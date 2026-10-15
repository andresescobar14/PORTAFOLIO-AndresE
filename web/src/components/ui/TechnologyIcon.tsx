import {
  SiHtml5, SiCss, SiTailwindcss, SiJavascript, SiTypescript, SiNextdotjs,
  SiReact, SiSupabase, SiMongodb, SiPython, SiNodedotjs, SiPostgresql,
} from 'react-icons/si';
import type { IconType } from 'react-icons';

const icons: Record<string, IconType> = {
  HTML: SiHtml5, CSS: SiCss, 'Tailwind CSS': SiTailwindcss, JavaScript: SiJavascript,
  TypeScript: SiTypescript, 'Next.js': SiNextdotjs, 'React.js': SiReact,
  Supabase: SiSupabase, MongoDB: SiMongodb, Python: SiPython,
  'Node.js': SiNodedotjs, PostgreSQL: SiPostgresql,
};
export function TechnologyIcon({ name }: { name: string }) {
  const Icon = icons[name];
  return Icon ? <Icon size={24} aria-hidden="true" focusable="false" /> : null;
}
