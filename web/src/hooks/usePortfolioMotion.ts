'use client';
import { useEffect } from 'react';

let aosInitialized = false;

export function usePortfolioMotion() {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) return;
    let disposed = false;
    let cleanupAnimation: (() => void) | undefined;
    const timer = window.setTimeout(async () => {
      try {
        const [{ gsap }, { default: AOS }] = await Promise.all([import('gsap'), import('aos')]);
        if (disposed || reducedMotion.matches) return;
        const context = gsap.context(() => {
          gsap.from('.hero-art .code-window', { y: 18, duration: 0.85, ease: 'power2.out' });
          gsap.from('.hero-art .interface-window', { y: 24, duration: 1, ease: 'power2.out' });
          gsap.from('.floating-chip', { y: 12, duration: 0.8, stagger: 0.12, ease: 'power2.out' });
        });
        cleanupAnimation = () => context.revert();
        document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
          if (element.getBoundingClientRect().top > window.innerHeight) element.dataset.aos = 'fade-up';
        });
        if (!aosInitialized) {
          AOS.init({ duration: 550, once: true, offset: 35, disableMutationObserver: true });
          aosInitialized = true;
        } else AOS.refreshHard();
      } catch {
        // El contenido sigue visible si falla una mejora visual opcional.
      }
    }, 150);
    const stop = () => {
      if (!reducedMotion.matches) return;
      cleanupAnimation?.();
      document.querySelectorAll('[data-aos]').forEach((element) => element.removeAttribute('data-aos'));
    };
    reducedMotion.addEventListener('change', stop);
    return () => {
      disposed = true;
      window.clearTimeout(timer);
      cleanupAnimation?.();
      reducedMotion.removeEventListener('change', stop);
    };
  }, []);
}
