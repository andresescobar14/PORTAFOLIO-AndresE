import { ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { technologies } from '@/data/portfolio';

export function SkillsSection() {
  return <section id="tecnologias" className="skills-section section-pad" aria-labelledby="skills-title">
    <div className="shell">
      <div className="section-title-row"><div id="skills-title"><SectionHeading number="01" label="CONOCIMIENTOS TÉCNICOS" title="Las herramientas detrás de las ideas." /></div><p className="side-note">Del frontend a los datos.<br />Tecnologías para construir soluciones completas.</p></div>
      <div className="skills-grid">
        {technologies.map((tech) => <article className="skill-card" key={tech.name} data-reveal>
          <div className="skill-top"><span className={`tech-mark tech-${tech.color}`} aria-hidden="true">{tech.mark}</span><span className="tech-category">{tech.category}</span></div>
          <h3>{tech.name}</h3><p>{tech.detail}</p>
        </article>)}
      </div>
      <div className="skills-footnote"><span className="small-dot" /><p>La tecnología cambia. Las ganas de aprender, se quedan.</p><ArrowUpRight size={17} aria-hidden="true" /></div>
    </div>
  </section>;
}
