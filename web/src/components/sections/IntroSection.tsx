import { ArrowDown, ArrowUpRight, CodeXml, Layers, Sparkles } from 'lucide-react';
import { profile } from '@/data/portfolio';
import { MotionToggle } from '@/components/motion/MotionToggle';

function DeveloperCanvas() {
  return <div className="hero-art" aria-label="Ilustración de un editor de código y una interfaz web" role="img">
    <div className="canvas-grid" />
    <span className="canvas-orbit orbit-one" /><span className="canvas-orbit orbit-two" />
    <div className="code-window">
      <div className="window-toolbar"><span className="window-dots"><i /><i /><i /></span><span>hello-world.tsx</span><CodeXml size={15} /></div>
      <div className="code-content" aria-hidden="true">
        <div><span className="line-number">01</span><span className="syntax-muted">{'// Las buenas ideas empiezan aquí.'}</span></div>
        <div><span className="line-number">02</span><span><b>const</b> developer = {'{'}</span></div>
        <div><span className="line-number">03</span><span>&nbsp; name: <em>&apos;{profile.shortName}&apos;</em>,</span></div>
        <div><span className="line-number">04</span><span>&nbsp; focus: <em>&apos;full-stack&apos;</em>,</span></div>
        <div><span className="line-number">05</span><span>&nbsp; mindset: <em>&apos;always learning&apos;</em></span></div>
        <div><span className="line-number">06</span><span>{'};'}</span></div>
        <div><span className="line-number">07</span><span>&nbsp;</span></div>
        <div><span className="line-number">08</span><span><b>build</b>(ideas).<b>makeItReal</b>();</span></div>
      </div>
      <div className="window-status"><span><i /> Una idea, muchas posibilidades</span><span>UTF-8</span></div>
    </div>
    <div className="interface-window">
      <div className="interface-top"><span className="mini-logo">ae.</span><span /><span /><i /></div>
      <div className="interface-body"><div><span className="mini-overline" /><span className="mini-heading" /><span className="mini-heading short" /><span className="mini-line" /><span className="mini-button" /></div><div className="mini-sculpture"><i /><i /><i /></div></div>
      <div className="interface-bottom"><span /><span /><span /></div>
    </div>
    <div className="floating-chip chip-design"><Sparkles size={16} /><span>Diseño que se siente.</span></div>
    <div className="floating-chip chip-code"><span className="chip-icon"><Layers size={17} /></span><div><strong>De la idea a la web</strong><small>Una línea a la vez.</small></div><span className="chip-check">↗</span></div>
    <span className="canvas-label">DISEÑAR. CONSTRUIR. MEJORAR.</span>
  </div>;
}

export function IntroSection() {
  return <section id="inicio" className="hero shell" aria-labelledby="hero-title">
    <div className="hero-copy">
      <p className="status-pill"><span /> EN CONSTANTE CONSTRUCCIÓN</p>
      <p className="hero-greeting">Hola, soy {profile.shortName} <span aria-hidden="true">↗</span></p>
      <h1 id="hero-title">Ideas claras.<br />Código que<br /><span>las hace reales.</span></h1>
      <p className="hero-description">{profile.introduction}</p>
      <div className="hero-actions">
        <a href="#proyectos" className="button button-primary">Explorar proyectos <ArrowUpRight size={18} aria-hidden="true" /></a>
        <a href={profile.github} className="button button-text" target="_blank" rel="noopener noreferrer"><CodeXml size={18} aria-hidden="true" /> Mi GitHub</a>
      </div>
      <div className="hero-note"><span className="note-line" /> De la primera idea al último detalle.</div><MotionToggle />
    </div>
    <DeveloperCanvas />
    <div className="hero-bottom"><span>DESARROLLO CON INTENCIÓN</span><a href="#tecnologias">Un poco más sobre mi mundo <ArrowDown size={15} aria-hidden="true" /></a><span>PORTAFOLIO / 01</span></div>
  </section>;
}
