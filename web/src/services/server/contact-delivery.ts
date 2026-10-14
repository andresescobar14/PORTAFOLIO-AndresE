import 'server-only';
import type { DeliverContact } from '@/types/contact';

export function isContactConfigured() {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    && process.env.RESEND_API_KEY && process.env.CONTACT_FROM_EMAIL && process.env.CONTACT_TO_EMAIL);
}

export const deliverContact: DeliverContact = async ({ name, email, message }) => {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL,
      to: [process.env.CONTACT_TO_EMAIL],
      reply_to: email,
      subject: 'Nuevo mensaje desde el portafolio',
      text: `Nombre: ${name}\nCorreo: ${email}\n\n${message}`,
    }),
    signal: AbortSignal.timeout(8000),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('CONTACT_DELIVERY_FAILED');
};
