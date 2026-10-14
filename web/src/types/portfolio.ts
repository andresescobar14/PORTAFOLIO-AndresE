export type NavigationLink = { label: string; href: `#${string}` };
export type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  imageAlt: string;
  technologies: readonly string[];
  kind: 'project' | 'concept';
  repository?: string;
  demo?: string;
};
