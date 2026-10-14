import { isIP } from 'node:net';

type Environment = { NODE_ENV?: string; VERCEL?: string; TRUSTED_PROXY_IP_HEADER?: string };

export function getClientIp(request: Request, env: Environment = process.env): string | undefined {
  if (env.NODE_ENV === 'development') return '127.0.0.1';
  // Un proxy propio debe sobrescribir esta cabecera y bloquear acceso directo.
  const header = env.VERCEL === '1' ? 'x-vercel-forwarded-for' : env.TRUSTED_PROXY_IP_HEADER;
  if (!header) return undefined;
  const candidate = request.headers.get(header)?.split(',')[0]?.trim();
  if (!candidate || !isIP(candidate)) return undefined;
  return isIP(candidate) === 6
    ? new URL(`http://[${candidate}]/`).hostname.slice(1, -1)
    : candidate;
}
