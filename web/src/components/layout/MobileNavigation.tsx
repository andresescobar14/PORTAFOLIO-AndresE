'use client';
import { useRef } from 'react';
import { Menu } from 'lucide-react';
import type { NavigationLink } from '@/types/portfolio';

export function MobileNavigation({ links }: { links: readonly NavigationLink[] }) {
  const details = useRef<HTMLDetailsElement>(null);
  return <details className="mobile-navigation" ref={details}
    onClick={(event) => {
      if (event.target instanceof Element && event.target.closest('a') && details.current) details.current.open = false;
    }}
    onKeyDown={(event) => {
      if (event.key === 'Escape' && details.current) {
        details.current.open = false;
        details.current.querySelector('summary')?.focus();
      }
    }}>
    <summary aria-label="Abrir navegación"><Menu size={22} aria-hidden="true" /></summary>
    <nav aria-label="Navegación móvil">
      {links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
      <a href="#contacto">Contacto</a>
    </nav>
  </details>;
}
