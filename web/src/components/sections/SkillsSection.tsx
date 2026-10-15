import { ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { technologies } from '@/data/portfolio';
import { TechnologyIcon } from '@/components/ui/TechnologyIcon';
import { TechnologyMarquee } from '@/components/motion/TechnologyMarquee';

export function SkillsSection() {
  return <section id="tecnologias" className="skills-section section-pad" aria-labelledby="skills-title">
    <div className="shell">
      <div className="section-title-row"><div id="skills-title"><SectionHeading number="01" label="CONOCIMIENTOS TÉCNICOS" title="Las herramientas detrás de las ideas." /></div><p className="side-note">Del frontend a los datos.<br />Tecnologías para construir soluciones completas.</p></div>
      <TechnologyMarquee>{technologies.map((tech) => <div className="marquee-item" key={tech.name}><TechnologyIcon name={tech.name} /><span>{tech.name}</span></div>)}</TechnologyMarquee>
      <div className="skills-grid grid grid-cols-1 min-[360px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
        {technologies.map((tech, index) => <article className="skill-card" key={tech.name} data-reveal="fade-up" data-reveal-delay={(index % 4) * 60} data-glow>
          <div className="card-ambient" aria-hidden="true"><i /><i /></div><div className="skill-top"><span className={`tech-mark tech-${tech.color}`}><TechnologyIcon name={tech.name} /></span><span className="tech-category">{tech.category}</span></div>
          <h3>{tech.name}</h3><p>{tech.detail}</p>
        </article>)}
      </div>
      <div className="skills-footnote"><span className="small-dot" /><p>La tecnología cambia. Las ganas de aprender, se quedan.</p><ArrowUpRight size={17} aria-hidden="true" /></div>
    </div>
  </section>;
}
