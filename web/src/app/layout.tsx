import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { profile } from '@/data/portfolio';
import './globals.css';
import { themeScript } from '@/lib/theme-script';
import { motionScript } from '@/lib/motion-script';

const bodyFont = localFont({
  src: '../../node_modules/@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2',
  variable: '--font-body', display: 'optional', weight: '100 900',
});
const headingFont = localFont({
  src: '../../node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2',
  variable: '--font-heading', display: 'optional', weight: '300 700',
});

export const metadata: Metadata = {
  title: `${profile.fullName} — Desarrollo Web Full-Stack`,
  description: 'Andres Escobar, Desarrollador Full Stack. Herramientas digitales a la medida para optimizar procesos y potenciar negocios.',
  applicationName: `${profile.fullName} · Portfolio`,
  openGraph: { title: `${profile.fullName} — Desarrollo Web Full-Stack`, description: 'Diseño, código y atención al detalle.', type: 'website', locale: 'es_ES' },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="es" data-theme="dark" data-motion="full" data-motion-version="3" suppressHydrationWarning className={`${bodyFont.variable} ${headingFont.variable}`}>
    <head><script dangerouslySetInnerHTML={{ __html: themeScript + motionScript }} /></head>
    <body>{children}</body>
  </html>;
}
