'use client';

import { ArrowUpRight, CheckCircle2, CircleAlert, LoaderCircle, ShieldCheck } from 'lucide-react';
import { CONTACT_ACTION } from '@/services/client/contact-api';
import { useContactForm } from '@/hooks/useContactForm';
import type { SendContact } from '@/types/contact';

export function ContactForm({ send }: { send?: SendContact }) {
  const { pending, result, errors, onSubmit } = useContactForm(send);
  return <form action={CONTACT_ACTION} method="post" className="contact-form" data-reveal="fade-up" data-reveal-delay="120" onSubmit={onSubmit} noValidate aria-label="Formulario de contacto" aria-busy={pending}>
    <h3>Todo empieza con un hola.</h3>
    <input type="hidden" name="_subject" value="Nuevo mensaje desde el portafolio de Andres Escobar" />
    <input type="hidden" name="_template" value="table" />
    <fieldset className="form-fields" disabled={pending}>
      <div><label htmlFor="contact-name">Tu nombre</label><input id="contact-name" name="name" autoComplete="name" placeholder="¿Cómo te llamas?" maxLength={80} required aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} />{errors.name && <p className="field-error" id="name-error">{errors.name}</p>}</div>
      <div><label htmlFor="contact-email">Tu correo</label><input id="contact-email" name="email" type="email" autoComplete="email" placeholder="hola@tucorreo.com" maxLength={254} required aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} />{errors.email && <p className="field-error" id="email-error">{errors.email}</p>}</div>
      <div><label htmlFor="contact-message">Cuéntame tu idea</label><textarea id="contact-message" name="message" rows={4} placeholder="Un proyecto, una oportunidad o simplemente un saludo…" minLength={20} maxLength={3000} required aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'message-error' : undefined} />{errors.message && <p className="field-error" id="message-error">{errors.message}</p>}</div>
      <div className="honeypot" aria-hidden="true"><label htmlFor="contact-website">Deja este campo vacío</label><input id="contact-website" name="website" autoComplete="off" tabIndex={-1} /></div>
    </fieldset>
    <button className="button button-primary form-submit" type="submit" disabled={pending}>{pending ? 'Enviando…' : 'Enviar mensaje'}{pending ? <LoaderCircle className="spinner" size={18} aria-hidden="true" /> : <ArrowUpRight size={18} aria-hidden="true" />}</button>
    {result && <p className={`form-result ${result.ok ? 'form-success' : 'field-error'}`} role={result.ok ? 'status' : 'alert'}>{result.ok ? <CheckCircle2 size={17} aria-hidden="true" /> : <CircleAlert size={17} aria-hidden="true" />}{result.message}</p>}
    <p className="form-privacy"><ShieldCheck size={14} aria-hidden="true" /> Tu correo se usará solo para responderte.</p>
  </form>;
}
