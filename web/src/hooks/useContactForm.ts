'use client';

import { useRef, useState, type FormEvent } from 'react';
import { contactSchema } from '@/domain/contact/contact.schema';
import { sendContact } from '@/services/client/contact-api';
import type { ContactResult, SendContact } from '@/types/contact';

export function useContactForm(send: SendContact = sendContact) {
  const busy = useRef(false);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<ContactResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const form = event.currentTarget;
    const parsed = contactSchema.safeParse(Object.fromEntries(new FormData(form)));
    setResult(null);
    if (!parsed.success) {
      const issues = Object.fromEntries(parsed.error.issues.map((issue) => [String(issue.path[0]), issue.message]));
      setErrors(issues);
      const first = form.elements.namedItem(Object.keys(issues)[0]);
      if (first instanceof HTMLElement) first.focus();
      return;
    }
    setErrors({});
    busy.current = true;
    setPending(true);
    try {
      const response = await send(parsed.data);
      setResult(response);
      if (response.ok) form.reset();
    } catch {
      setResult({ ok: false, message: 'No pudimos conectar. Revisa tu conexión e inténtalo de nuevo.' });
    } finally {
      busy.current = false;
      setPending(false);
    }
  }

  return { pending, result, errors, onSubmit };
}
