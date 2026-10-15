import { Play, Pause } from 'lucide-react';

export function MotionToggle() {
  return <button className="motion-toggle" type="button" data-motion-toggle aria-label="Pausar animaciones" aria-pressed="true" suppressHydrationWarning>
    <Play className="motion-play" size={14} aria-hidden="true" />
    <Pause className="motion-pause" size={14} aria-hidden="true" />
    <span className="motion-play">Activar animaciones</span>
    <span className="motion-pause">Pausar animaciones</span>
  </button>;
}
