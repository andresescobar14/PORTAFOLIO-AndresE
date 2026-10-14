import { contactSchema } from './contact.schema';
import type { RateLimiter } from '@/types/rate-limit';
import type { DeliverContact } from '@/types/contact';

type Dependencies = {
  limiter: RateLimiter;
  deliver: DeliverContact;
  getClientIp: (request: Request) => string | undefined;
  isConfigured: () => boolean;
};

const MAX_BYTES = 8192;
const reply = (status: number, message: string, headers: Record<string, string> = {}) =>
  Response.json({ ok: status < 400, message }, { status, headers: { 'Cache-Control': 'no-store', ...headers } });
const unavailable = () => reply(503, 'El envío no está disponible ahora. Puedes contactarme a través de GitHub.', { 'Retry-After': '30' });

class PayloadTooLarge extends Error {}

async function readBoundedJson(request: Request): Promise<unknown> {
  if (Number(request.headers.get('content-length')) > MAX_BYTES) throw new PayloadTooLarge();
  const reader = request.body?.getReader();
  if (!reader) throw new SyntaxError('Missing body');
  let size = 0;
  let content = '';
  const decoder = new TextDecoder('utf-8', { fatal: true });
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) {
        await reader.cancel();
        throw new PayloadTooLarge();
      }
      content += decoder.decode(value, { stream: true });
    }
    return JSON.parse(content + decoder.decode());
  } finally {
    reader.releaseLock();
  }
}

// La protección vive en el mismo punto de entrada que el envío; no hay otra
// ruta o Server Action que pueda saltarse el límite accidentalmente.
export function createContactHandler(dependencies: Dependencies) {
  return async function handleContact(request: Request) {
    const origin = request.headers.get('origin');
    if (origin && origin !== new URL(request.url).origin) return reply(403, 'Origen no permitido.');
    if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
      return reply(415, 'Se requiere contenido JSON.');
    }
    if (!dependencies.isConfigured()) return unavailable();
    const ip = dependencies.getClientIp(request);
    if (!ip) return unavailable();

    try {
      const quota = await dependencies.limiter.check(ip);
      if (!quota.allowed) {
        const seconds = Math.max(1, Math.ceil((quota.resetAt - Date.now()) / 1000));
        return reply(429, `Espera ${seconds} segundos antes de reintentar.`, {
          'Retry-After': String(seconds),
          'X-RateLimit-Limit': String(quota.limit),
          'X-RateLimit-Remaining': String(quota.remaining),
        });
      }
    } catch {
      return unavailable();
    }

    let input: unknown;
    try {
      input = await readBoundedJson(request);
    } catch (error) {
      return error instanceof PayloadTooLarge
        ? reply(413, 'El mensaje supera el tamaño permitido.')
        : reply(400, 'El contenido del mensaje no es válido.');
    }
    const parsed = contactSchema.safeParse(input);
    if (!parsed.success) return reply(400, 'Revisa tu nombre, correo y mensaje.');
    if (parsed.data.website) return reply(202, 'Gracias por escribir.');

    try {
      await dependencies.deliver(parsed.data);
      return reply(200, 'Mensaje enviado. Gracias por escribir.');
    } catch {
      return unavailable();
    }
  };
}
