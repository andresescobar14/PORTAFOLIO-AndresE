import Image from 'next/image';
import { ArrowUpRight, CodeXml, Radio } from 'lucide-react';
import { SiGithub } from 'react-icons/si';
import type { Project } from '@/types/portfolio';
import { profile } from '@/data/portfolio';

export function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  return <article className={`project-card ${featured ? 'project-featured' : ''}`} data-reveal="fade-up" data-reveal-delay={featured ? 0 : 80} data-glow>
    <div className="card-ambient" aria-hidden="true"><i /><i /></div><div className={`project-preview preview-${project.id}`}>
      <Image src={project.image} alt={project.imageAlt} width={1000} height={650} loading="lazy" decoding="async" sizes={featured ? '(max-width: 767px) calc(100vw - 62px), (max-width: 1400px) calc(66.67vw - 92px), 840px' : '(max-width: 767px) calc(100vw - 62px), (max-width: 1023px) calc(50vw - 66px), (max-width: 1400px) calc(50vw - 82px), 600px'} />
      <span className="project-badge">{project.demo ? 'Demo en vivo' : 'Código disponible'}</span>
    </div>
    <div className="project-information">
      <p className="project-category">{project.category}</p>
      <div className="project-title"><h3>{project.title}</h3><ArrowUpRight className="project-heading-arrow" size={23} aria-hidden="true" /></div>
      <p className="project-description">{project.description}</p>
      <div className="project-tags">{project.technologies.map((tech) => <span key={tech}>{tech}</span>)}</div>
      <div className="project-actions">
        {project.demo ? <a className="project-action action-demo" href={project.demo} target="_blank" rel="noopener noreferrer" aria-label={`Demo En Vivo de ${project.title}`}><Radio size={15} aria-hidden="true" />Demo En Vivo</a>
          : <span className="project-action action-unavailable" aria-disabled="true" title="Este proyecto aún no tiene una demo publicada"><Radio size={15} aria-hidden="true" />Demo pendiente</span>}
        {project.repository && <a className="project-action" href={project.repository} target="_blank" rel="noopener noreferrer" aria-label={`Ver Código de ${project.title}`}><CodeXml size={15} aria-hidden="true" />Ver Código</a>}
        <a className="project-action" href={profile.github} target="_blank" rel="noopener noreferrer" aria-label={`GitHub de Andres, autor de ${project.title}`}><SiGithub size={15} aria-hidden="true" />GitHub</a>
      </div>
    </div>
  </article>;
}
