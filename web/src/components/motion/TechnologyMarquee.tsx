'use client';

import { useState, type ReactNode } from 'react';
import { Pause, Play } from 'lucide-react';

export function TechnologyMarquee({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(false);
  return <div className="marquee-region">
    <div className="marquee" id="technology-marquee" data-paused={paused}>
      <div className="marquee-track">
        <div className="marquee-group">{children}</div>
        <div className="marquee-group marquee-copy" aria-hidden="true">{children}</div>
      </div>
    </div>
    <button type="button" className="marquee-toggle" aria-controls="technology-marquee" aria-pressed={paused} onClick={() => setPaused(!paused)}>
      {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
      {paused ? 'Reanudar movimiento' : 'Pausar movimiento'}
    </button>
  </div>;
}
