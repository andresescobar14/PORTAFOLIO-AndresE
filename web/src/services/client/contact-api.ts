import type { SendContact } from '@/types/contact';

export const sendContact: SendContact = async (message) => {
  const response = await fetch('/api/contact', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message), signal: AbortSignal.timeout(15_000),
  });
  const body = await response.json();
  return {
    ok: response.ok && body.ok === true,
    message: typeof body.message === 'string' ? body.message : 'No se pudo enviar. Inténtalo de nuevo.',
  };
};
