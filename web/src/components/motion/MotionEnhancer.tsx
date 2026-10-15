'use client';
import { usePortfolioMotion } from '@/hooks/usePortfolioMotion';

export function MotionEnhancer() {
  usePortfolioMotion();
  return <div className="cursor-aura" data-cursor-aura aria-hidden="true" />;
}
