import Link from 'next/link';

export default function NotFound() {
  return <main className="not-found shell"><p className="eyebrow">404 / FUERA DEL MAPA</p><h1>Esta idea todavía<br />no tiene página.</h1><p>Volvamos a un lugar conocido.</p><Link className="button button-primary" href="/">Volver al portafolio ↗</Link></main>;
}
