import { ArrowUpRight, CodeXml, Link, Mail, MessageCircle } from 'lucide-react';
import { ContactForm } from '@/components/contact/ContactForm';
import { profile } from '@/data/portfolio';

export function ContactSection({ enabled }: { enabled: boolean }) {
  return <section id="contacto" className="contact-section" aria-labelledby="contact-title"><div className="shell contact-grid">
    <div className="contact-copy" data-reveal><p className="eyebrow"><span>03</span>SIGAMOS LA CONVERSACIÓN</p><h2 id="contact-title">Tu próxima idea<br />puede empezar<br /><span>con un hola.</span></h2><p>¿Tienes algo en mente?<br />Me encantará conocerlo.</p><div className="contact-socials"><a href={profile.github} target="_blank" rel="noopener noreferrer"><CodeXml size={20} aria-hidden="true" /> Encuéntrame en GitHub <ArrowUpRight size={17} aria-hidden="true" /></a>
      {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"><Link size={20} /> LinkedIn <ArrowUpRight size={17} /></a>}
      {profile.email && <a href={`mailto:${profile.email}`}><Mail size={20} aria-hidden="true" />{profile.email}</a>}
      <a href={profile.whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle size={20} aria-hidden="true" />WhatsApp · {profile.phoneDisplay}<ArrowUpRight size={17} aria-hidden="true" /></a>
    </div><span className="contact-decoration" aria-hidden="true">↗</span></div>
    <ContactForm enabled={enabled} fallbackEmail={profile.email} />
  </div></section>;
}
