import { profile } from '@/data/portfolio';
import type { SendContact } from '@/types/contact';

export const CONTACT_ACTION = `https://formsubmit.co/${profile.email}`;
const CONTACT_ENDPOINT = `https://formsubmit.co/ajax/${profile.email}`;
const FAILURE_MESSAGE = 'No se pudo enviar el mensaje. Inténtalo de nuevo o escríbeme por correo.';

/** FormSubmit owns delivery and abuse protection; no private keys reach the browser. */
export const sendContact: SendContact = async ({ name, email, message, website }) => {
  if (website) return { ok: true, message: 'Gracias por escribir.' };

  const response = await fetch(CONTACT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      name, email, message,
      _subject: 'Nuevo mensaje desde el portafolio de Andres Escobar',
      _template: 'table',
      _url: window.location.href.split('#')[0],
      _honey: website,
    }),
    signal: AbortSignal.timeout(15_000),
  });
  const body: unknown = await response.json();
  const accepted = response.ok && typeof body === 'object' && body !== null
    && 'success' in body && (body.success === true || body.success === 'true');
  return {
    ok: accepted,
    message: accepted ? 'Solicitud enviada. Gracias por escribir; te responderé por correo.' : FAILURE_MESSAGE,
  };
};
