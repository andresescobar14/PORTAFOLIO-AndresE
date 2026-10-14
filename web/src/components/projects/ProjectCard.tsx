import Image from 'next/image';
import { ArrowUpRight, CodeXml } from 'lucide-react';
import type { Project } from '@/types/portfolio';

export function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  return <article className={`project-card ${featured ? 'project-featured' : ''}`} data-reveal>
    <div className={`project-preview preview-${project.id}`}>
      <Image src={project.image} alt={project.imageAlt} width={1000} height={650} sizes={featured ? '(max-width: 760px) 100vw, 65vw' : '(max-width: 760px) 100vw, 45vw'} />
      <span className="project-badge">{project.demo ? 'Demo en vivo' : 'Código disponible'}</span>
    </div>
    <div className="project-information">
      <p className="project-category">{project.category}</p>
      <div className="project-title"><h3>{project.title}</h3>{project.repository && <a href={project.repository} target="_blank" rel="noopener noreferrer" className="project-arrow" aria-label={`Ver código de ${project.title}`}><ArrowUpRight size={22} aria-hidden="true" /></a>}</div>
      <p className="project-description">{project.description}</p>
      <div className="project-meta"><div className="project-tags">{project.technologies.map((tech) => <span key={tech}>{tech}</span>)}</div>
        {project.demo && <a href={project.demo} target="_blank" rel="noopener noreferrer">Ver demo <ArrowUpRight size={15} /></a>}
        {project.repository && <a href={project.repository} target="_blank" rel="noopener noreferrer"><CodeXml size={15} aria-hidden="true" /> Código</a>}
      </div>
    </div>
  </article>;
}
