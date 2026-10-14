import { ArrowUpRight, ArrowUp } from 'lucide-react';
import { profile } from '@/data/portfolio';

export function Footer() {
  return <footer className="shell footer">
    <p><strong>{profile.fullName}<span>.</span></strong><small>Hecho con intención. Construido con código.</small></p>
    <div className="footer-links">
      <a href={profile.repository} target="_blank" rel="noopener noreferrer">Código de este sitio <ArrowUpRight size={15} aria-hidden="true" /></a>
      <a href="#inicio" className="back-to-top" aria-label="Volver al inicio"><ArrowUp size={18} aria-hidden="true" /></a>
    </div>
  </footer>;
}
