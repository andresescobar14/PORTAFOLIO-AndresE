import type { NavigationLink, Project } from '@/types/portfolio';

// Identidad, conocimientos y selección de repositorios proporcionados por Andres.
export const profile = {
  fullName: 'Andres Escobar',
  shortName: 'Andres',
  profession: 'Programador Web Full Stack',
  introduction: '¿Necesitas una plataforma web que no solo se vea bien, sino que funcione a la perfección? Soy Andres Escobar, Desarrollador Full Stack. Me especializo en crear herramientas digitales a la medida que optimizan procesos y potencian negocios. Cuéntame tu idea y la hacemos realidad.',
  github: 'https://github.com/andresescobar14',
  repository: 'https://github.com/andresescobar14/PORTAFOLIO-AndresE',
  email: 'gamerandres0102@gmail.com',
  phone: '+584126716146',
  phoneDisplay: '+58 412 671 6146',
  whatsapp: 'https://wa.me/584126716146',
  linkedin: '',
};

export const navigation: NavigationLink[] = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Tecnologías', href: '#tecnologias' },
  { label: 'Proyectos', href: '#proyectos' },
];

export const technologies = [
  { name: 'HTML', detail: 'Estructuras claras y accesibles', mark: 'H', category: 'Frontend', color: 'orange' },
  { name: 'CSS', detail: 'Composición y diseño responsive', mark: '#', category: 'Estilos', color: 'blue' },
  { name: 'Tailwind CSS', detail: 'Diseño hasta el detalle', mark: '≈', category: 'Estilos', color: 'cyan' },
  { name: 'JavaScript', detail: 'Interacciones que conectan', mark: 'JS', category: 'Lenguaje', color: 'yellow' },
  { name: 'TypeScript', detail: 'Claridad en cada función', mark: 'TS', category: 'Lenguaje', color: 'blue' },
  { name: 'Next.js', detail: 'La base de la experiencia', mark: 'N', category: 'Framework', color: 'ink' },
  { name: 'React.js', detail: 'Interfaces que responden', mark: '⚛', category: 'Frontend', color: 'sky' },
  { name: 'Supabase', detail: 'Datos y autenticación', mark: 'S', category: 'Backend', color: 'green' },
  { name: 'MongoDB', detail: 'Datos con flexibilidad', mark: 'M', category: 'Base de datos', color: 'green' },
  { name: 'Python', detail: 'Lógica y automatización', mark: 'Py', category: 'Lenguaje', color: 'blue' },
  { name: 'Node.js', detail: 'El trabajo entre bastidores', mark: 'js', category: 'Backend', color: 'green' },
  { name: 'PostgreSQL', detail: 'Una base sólida para los datos', mark: 'Pg', category: 'Base de datos', color: 'blue' },
] as const;

export const projects: readonly Project[] = [
  {
    id: 'rick-morty', title: 'Rick & Morty', category: 'EXPLORADOR DE PERSONAJES · API REST',
    description: 'Un archivo interdimensional con búsqueda, filtros, paginación, detalles y favoritos locales. Datos de The Rick and Morty API en una interfaz animada y responsive.',
    image: '/projects/rick-morty.jpg', imageAlt: 'Captura real del catálogo de personajes de Rick & Morty desarrollado por Andres Escobar',
    technologies: ['JavaScript', 'API REST', 'GSAP'], kind: 'project',
    repository: 'https://github.com/andresescobar14/ProyectoRickAndMorty-Andres',
    demo: 'https://rick-morty-andres.vercel.app/main.html',
  },
  {
    id: 'youtube', title: 'Copia de YouTube', category: 'FRONTEND · RECREACIÓN EDUCATIVA',
    description: 'Una recreación de interfaz con búsqueda, filtros, biblioteca local y temas claro y oscuro. Un ejercicio de diseño adaptable e interacción, sin servicio de streaming.',
    image: '/projects/youtube.png', imageAlt: 'Captura real de la interfaz de la copia educativa de YouTube de Andres Escobar',
    technologies: ['HTML', 'CSS', 'JavaScript'], kind: 'project',
    repository: 'https://github.com/andresescobar14/Copia-YouTube-Andres',
    demo: 'https://andresescobar14.github.io/Copia-YouTube-Andres/',
  },
  {
    id: 'spotify', title: 'Copia de Spotify', category: 'FRONTEND · REPRODUCTOR MUSICAL',
    description: 'Reproductor educativo con vistas previas de audio, búsqueda, controles de reproducción y biblioteca personal. Una experiencia musical adaptada a móvil y escritorio.',
    image: '/projects/spotify.jpg', imageAlt: 'Captura real del reproductor musical de la copia educativa de Spotify de Andres Escobar',
    technologies: ['JavaScript', 'Tailwind CSS', 'Audio'], kind: 'project',
    repository: 'https://github.com/andresescobar14/Proyecto-Spotify-Andres',
    demo: 'https://andresescobar14.github.io/Proyecto-Spotify-Andres/',
  },
  {
    id: 'barberia', title: 'Barbería · Turnos', category: 'FULL STACK · RESERVAS',
    description: 'Agenda digital para una barbería: selección de servicios, fecha y hora, validación del formulario y registro de reservas en Supabase.',
    image: '/projects/barberia.jpg', imageAlt: 'Captura real de la aplicación de turnos de barbería desarrollada por Andres Escobar',
    technologies: ['Next.js', 'TypeScript', 'Supabase'], kind: 'project',
    repository: 'https://github.com/andresescobar14/barberia-turnos',
    demo: 'https://barberia-ae.vercel.app/',
  },
  {
    id: 'registro', title: 'Registro de usuarios', category: 'JAVASCRIPT · VALIDACIÓN DE FORMULARIOS',
    description: 'Una experiencia de registro por pasos, con validación accesible, indicador de contraseña y confirmación local. Diseño responsive sin dependencias externas.',
    image: '/projects/registro-nexo.jpg', imageAlt: 'Captura del formulario de registro de usuarios del repositorio proyecto-registro-andres',
    technologies: ['HTML', 'Tailwind CSS', 'JavaScript'], kind: 'project',
    repository: 'https://github.com/andresescobar14/proyecto-registro-andres',
    demo: 'https://proyecto-registro-andres.vercel.app/',
  },
];
