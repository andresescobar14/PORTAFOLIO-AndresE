import { ArrowUpRight } from 'lucide-react';
import type { NavigationLink } from '@/types/portfolio';
import { MobileNavigation } from './MobileNavigation';

export function Header({ fullName, profession, links }: {
  fullName: string; profession: string; links: readonly NavigationLink[];
}) {
  return <header className="site-header">
    <div className="shell header-inner">
      <a className="brand" href="#inicio" aria-label={`${fullName}, inicio`}>
        <span className="brand-mark" aria-hidden="true">a<span>e</span><i /></span>
        <span className="brand-text"><strong>{fullName}</strong><small>{profession}</small></span>
      </a>
      <nav className="desktop-navigation" aria-label="Navegación principal">
        {links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
      </nav>
      <a className="header-contact" href="#contacto">Hablemos <ArrowUpRight size={16} aria-hidden="true" /></a>
      <MobileNavigation links={links} />
    </div>
  </header>;
}
