'use client';

import { ArrowUpRight, LoaderCircle, ShieldCheck } from 'lucide-react';
import { useContactForm } from '@/hooks/useContactForm';
import type { SendContact } from '@/types/contact';

export function ContactForm({ enabled, send, fallbackEmail }: { enabled: boolean; send?: SendContact; fallbackEmail?: string }) {
  const { pending, result, errors, onSubmit } = useContactForm(send);
  return <form className="contact-form" onSubmit={onSubmit} noValidate aria-label="Formulario de contacto" aria-busy={pending}>
    <h3>Todo empieza con un hola.</h3>
    <div className="form-fields">
      <div><label htmlFor="contact-name">Tu nombre</label><input id="contact-name" name="name" autoComplete="name" placeholder="¿Cómo te llamas?" maxLength={80} required aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} />{errors.name && <p className="field-error" id="name-error">{errors.name}</p>}</div>
      <div><label htmlFor="contact-email">Tu correo</label><input id="contact-email" name="email" type="email" autoComplete="email" placeholder="hola@tucorreo.com" maxLength={254} required aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} />{errors.email && <p className="field-error" id="email-error">{errors.email}</p>}</div>
      <div><label htmlFor="contact-message">Cuéntame tu idea</label><textarea id="contact-message" name="message" rows={4} placeholder="Un proyecto, una oportunidad o simplemente un saludo…" minLength={20} maxLength={3000} required aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'message-error' : undefined} />{errors.message && <p className="field-error" id="message-error">{errors.message}</p>}</div>
      <div className="honeypot" aria-hidden="true"><label htmlFor="contact-website">Deja este campo vacío</label><input id="contact-website" name="website" autoComplete="off" tabIndex={-1} /></div>
    </div>
    {!enabled && <p className="form-notice" id="contact-unavailable">El formulario estará disponible pronto. Mientras tanto, {fallbackEmail ? <a href={`mailto:${fallbackEmail}`}>puedes escribirme por correo</a> : 'puedes encontrarme en GitHub'}.</p>}
    <button className="button button-primary form-submit" type="submit" disabled={pending || !enabled} aria-describedby={!enabled ? 'contact-unavailable' : undefined}>{pending ? 'Enviando…' : 'Enviar mensaje'}{pending ? <LoaderCircle className="spinner" size={18} aria-hidden="true" /> : <ArrowUpRight size={18} aria-hidden="true" />}</button>
    {result && <p className={`form-result ${result.ok ? 'form-success' : 'field-error'}`} role={result.ok ? 'status' : 'alert'}>{result.message}</p>}
    <p className="form-privacy"><ShieldCheck size={14} aria-hidden="true" /> Tu correo se usará solo para responderte.</p>
  </form>;
}
