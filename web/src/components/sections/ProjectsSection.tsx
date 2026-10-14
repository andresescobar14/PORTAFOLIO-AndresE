import { ArrowUpRight, MoveUpRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { profile, projects } from '@/data/portfolio';

export function ProjectsSection() {
  return <section id="proyectos" className="shell section-pad projects-section" aria-labelledby="projects-title">
    <div className="section-title-row"><div id="projects-title"><SectionHeading number="02" label="PROYECTOS SELECCIONADOS" title="Del editor al mundo real." description="Interfaces, aplicaciones y herramientas que he construido. Explora las demos o descubre el código detrás de cada proyecto." /></div><a className="text-link" href={profile.github} target="_blank" rel="noopener noreferrer">Explorar GitHub <ArrowUpRight size={17} aria-hidden="true" /></a></div>
    <div className="projects-grid"><ProjectCard project={projects[0]} featured />
      <aside className="project-manifesto" data-reveal><MoveUpRight size={58} strokeWidth={1} aria-hidden="true" /><p>Los detalles<br />hacen la<br /><em>diferencia.</em></p><span>Curiosidad para empezar.<br />Criterio para construir.</span></aside>
      {projects.slice(1).map((project) => <ProjectCard project={project} key={project.id} />)}
    </div>
    <p className="project-disclaimer">Las recreaciones de YouTube y Spotify son proyectos educativos independientes. Las capturas corresponden a los proyectos enlazados.</p>
  </section>;
}
