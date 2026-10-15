'use client';
import { useEffect } from 'react';

type Gsap = typeof import('gsap').gsap;
type QuickTo = ReturnType<Gsap['quickTo']>;


export function usePortfolioMotion() {
  useEffect(() => {
    const root = document.documentElement;
    // Reconcile startup during Fast Refresh as well as a complete page load.
    let savedMotion: string | null = null;
    try { savedMotion = localStorage.getItem('portfolio-motion-v3'); } catch { /* Storage may be blocked. */ }
    root.dataset.motion = savedMotion === 'reduced' ? 'reduced' : 'full';
    root.dataset.motionVersion = '3';
    const reduced = { get matches() { return root.dataset.motion !== 'full'; } };
    const finePointer = window.matchMedia('(any-hover: hover) and (any-pointer: fine)');
    const cursor = document.querySelector<HTMLElement>('[data-cursor-aura]');
    let disposed = false;
    let generation = 0;
    let motionContext: ReturnType<Gsap['context']> | undefined;
    let ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger | undefined;
    let gsap: Gsap | undefined;
    let gsapLoading: Promise<void> | undefined;
    let frame = 0;
    let active: HTMLElement | null = null;
    let bounds: DOMRect | undefined;
    let pointerX = 0;
    let pointerY = 0;
    let pointerInside = false;
    let cursorX: QuickTo | undefined;
    let cursorY: QuickTo | undefined;
    const tweens = new Map<HTMLElement, { x: QuickTo; y: QuickTo }>();
    const buttons = new Set<HTMLElement>();

    function loadGsap() {
      if (gsapLoading) return gsapLoading;
      if (reduced.matches) return;
      gsapLoading = Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([core, plugin]) => {
        if (disposed) return;
        gsap = core.gsap;
        ScrollTrigger = plugin.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);
        if (cursor) {
          cursorX = gsap.quickTo(cursor, 'x', { duration: .22, ease: 'power3.out' });
          cursorY = gsap.quickTo(cursor, 'y', { duration: .22, ease: 'power3.out' });
        }
        schedule();
      }).catch(() => { /* Permanent ambient light still works without motion. */ });
      return gsapLoading;
    }

    async function prepareScroll() {
      const run = ++generation;
      motionContext?.revert();
      motionContext = undefined;
      root.classList.remove('gsap-ready');
      root.dataset.motionEngine = 'paused';
      document.querySelectorAll<HTMLElement>('[data-reveal], .section-title-row').forEach((element) => { element.dataset.scrollState = 'visible'; });
      if (reduced.matches) return;
      await loadGsap();
      if (disposed || reduced.matches || run !== generation || !gsap || !ScrollTrigger) return;
      const engine = gsap;
      const Trigger = ScrollTrigger;
      motionContext = engine.context(() => {
        document.querySelectorAll<HTMLElement>('[data-reveal], .section-title-row').forEach((element) => {
          const delay = Math.min(Number(element.dataset.revealDelay || 0) / 1000, .18);
          element.dataset.scrollState = 'hidden';
          engine.fromTo(element, {
            opacity: 0, y: element.classList.contains('skill-card') ? 48 : 64, scale: .965,
          }, {
            opacity: 1, y: 0, scale: 1, duration: 1.05, delay,
            ease: 'power3.out', force3D: true,
            scrollTrigger: {
              trigger: element, start: 'top 92%', end: 'bottom top',
              toggleActions: 'play none none reverse', invalidateOnRefresh: true,
            },
            onStart: () => { element.dataset.scrollState = 'revealing'; },
            onComplete: () => { element.dataset.scrollState = 'visible'; },
            onReverseComplete: () => { element.dataset.scrollState = 'hidden'; },
          });
          const lights = element.querySelectorAll('.card-ambient i');
          if (lights.length) {
            const ambient = engine.to(lights, {
              x: (index) => index === 0 ? 34 : -28,
              y: (index) => index === 0 ? 22 : -18,
              scale: 1.18, opacity: 1, duration: 3.8, stagger: .5,
              repeat: -1, yoyo: true, paused: true, ease: 'sine.inOut', force3D: true,
            });
            Trigger.create({
              trigger: element, start: 'top bottom', end: 'bottom top',
              onEnter: () => { ambient.play(); }, onEnterBack: () => { ambient.play(); },
              onLeave: () => { ambient.pause(); }, onLeaveBack: () => { ambient.pause(); },
            });
          }
        });
      });
      root.dataset.motionEngine = 'gsap';
      root.classList.add('gsap-ready');
      Trigger.refresh();
      void document.fonts.ready.then(() => { if (!disposed && !reduced.matches) Trigger.refresh(); });
    }
    function showCard(card: HTMLElement | null) {
      if (card === active) return;
      if (active) {
        active.style.setProperty('--glow-opacity', '0');
        active.removeAttribute('data-glow-active');
      }
      active = card;
      bounds = undefined;
      if (active) {
        active.style.setProperty('--glow-opacity', '1');
        active.setAttribute('data-glow-active', 'true');
      }
    }

    function paint() {
      frame = 0;
      if (disposed) return;
      if (active) {
        bounds ??= active.getBoundingClientRect();
        const x = pointerX - bounds.left;
        const y = pointerY - bounds.top;
        if (gsap && !reduced.matches) {
          let setters = tweens.get(active);
          if (!setters) {
            // Establish the first position immediately; smooth subsequent moves.
            active.style.setProperty('--glow-x', String(x));
            active.style.setProperty('--glow-y', String(y));
            setters = {
              x: gsap.quickTo(active, '--glow-x', { duration: .22, ease: 'power3.out' }),
              y: gsap.quickTo(active, '--glow-y', { duration: .22, ease: 'power3.out' }),
            };
            tweens.set(active, setters);
          }
          setters.x(x); setters.y(y);
        } else {
          active.style.setProperty('--glow-x', String(x));
          active.style.setProperty('--glow-y', String(y));
        }
      }
      if (cursor && pointerInside && !reduced.matches && finePointer.matches) {
        cursor.style.opacity = '1';
        if (cursorX && cursorY) { cursorX(pointerX); cursorY(pointerY); }
        else cursor.style.transform = `translate3d(${pointerX}px,${pointerY}px,0)`;
      }
    }

    function schedule() {
      if (!frame) frame = window.requestAnimationFrame(paint);
    }

    function pointerMove(event: PointerEvent) {
      if (event.pointerType !== 'mouse' || !finePointer.matches) return;
      pointerInside = true;
      pointerX = event.clientX; pointerY = event.clientY;
      showCard(event.target instanceof Element ? event.target.closest<HTMLElement>('[data-glow]') : null);
      loadGsap(); schedule();
    }

    function hoverButton(event: PointerEvent, entering: boolean) {
      if (event.pointerType !== 'mouse' || reduced.matches) return;
      const button = event.target instanceof Element ? event.target.closest<HTMLElement>('.button, .project-action, .header-contact') : null;
      if (!button || button.matches(':disabled, [aria-disabled="true"]') || (event.relatedTarget instanceof Node && button.contains(event.relatedTarget))) return;
      buttons.add(button);
      if (gsap) gsap.to(button, { y: entering ? -3 : 0, duration: .2, overwrite: 'auto', ease: 'power2.out' });
    }
    const pointerOver = (event: PointerEvent) => hoverButton(event, true);
    const pointerOut = (event: PointerEvent) => hoverButton(event, false);
    function leave() {
      pointerInside = false;
      window.cancelAnimationFrame(frame);
      frame = 0;
      showCard(null);
      if (cursor) cursor.style.opacity = '0';
    }
    function invalidateBounds() { bounds = undefined; }
    function visibility() { if (document.hidden) leave(); }
    function preferenceChanged() {
      if (reduced.matches) {
        tweens.forEach((setters) => { setters.x.tween.kill(); setters.y.tween.kill(); });
        tweens.clear();
        buttons.forEach((button) => { gsap?.killTweensOf(button); button.style.removeProperty('transform'); });
        leave();
      }
      void prepareScroll();
    }

    void prepareScroll();
    document.addEventListener('pointermove', pointerMove, { passive: true });
    document.addEventListener('pointerover', pointerOver, { passive: true });
    document.addEventListener('pointerout', pointerOut, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    window.addEventListener('blur', leave);
    window.addEventListener('scroll', invalidateBounds, { passive: true });
    window.addEventListener('resize', invalidateBounds, { passive: true });
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('portfolio:motion-change', preferenceChanged);
    finePointer.addEventListener('change', leave);
    return () => {
      disposed = true;
      generation++;
      window.cancelAnimationFrame(frame);
      leave(); motionContext?.revert(); root.classList.remove('gsap-ready');
      document.removeEventListener('pointermove', pointerMove);
      document.removeEventListener('pointerover', pointerOver);
      document.removeEventListener('pointerout', pointerOut);
      document.documentElement.removeEventListener('pointerleave', leave);
      window.removeEventListener('blur', leave);
      window.removeEventListener('scroll', invalidateBounds);
      window.removeEventListener('resize', invalidateBounds);
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('portfolio:motion-change', preferenceChanged);
      finePointer.removeEventListener('change', leave);
      tweens.forEach((setters, element) => {
        setters.x.tween.kill(); setters.y.tween.kill();
        element.style.removeProperty('--glow-x'); element.style.removeProperty('--glow-y'); element.style.removeProperty('--glow-opacity');
      });
      cursorX?.tween.kill(); cursorY?.tween.kill();
      if (cursor) { gsap?.killTweensOf(cursor); cursor.removeAttribute('style'); }
      buttons.forEach((button) => { gsap?.killTweensOf(button); button.style.removeProperty('transform'); });
    };
  }, []);
}
