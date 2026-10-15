import { Moon, Sun } from 'lucide-react';

// Native delegated handling in the head responds before React hydration.
export function ThemeToggle() {
  return <button type="button" className="theme-toggle" data-theme-toggle aria-label="Activar modo claro" title="Cambiar a modo claro" aria-pressed="false" suppressHydrationWarning>
    <Sun className="theme-sun" size={18} aria-hidden="true" />
    <Moon className="theme-moon" size={18} aria-hidden="true" />
  </button>;
}
