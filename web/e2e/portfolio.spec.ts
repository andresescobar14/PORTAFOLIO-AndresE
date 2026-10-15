import { test, expect } from '@playwright/test';

test('the portfolio is readable, navigable and free of horizontal overflow', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Ideas claras.');
  await expect(page.getByRole('banner')).toContainText('Andres Escobar');
  await expect(page.getByRole('link', { name: 'gamerandres0102@gmail.com', exact: true })).toHaveAttribute('href', 'mailto:gamerandres0102@gmail.com');
  await expect(page.getByRole('link', { name: /WhatsApp/ })).toHaveAttribute('href', 'https://wa.me/584126716146');
  await expect(page.getByRole('heading', { name: 'Las herramientas detrás de las ideas.' })).toBeVisible();
  await page.getByRole('link', { name: 'Explorar proyectos', exact: true }).click();
  await expect(page).toHaveURL(/#proyectos$/);
  await expect(page.getByRole('heading', { name: 'Del editor al mundo real.' })).toBeInViewport();
  await page.getByRole('link', { name: 'Hablemos', exact: false }).click();
  await expect(page).toHaveURL(/#contacto$/);
  await expect(page.getByRole('heading', { name: 'Todo empieza con un hola.' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Enviar mensaje' })).toBeEnabled();
  await expect(page.locator('.contact-form')).toHaveAttribute('action', 'https://formsubmit.co/gamerandres0102@gmail.com');
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(Array.from(document.images).map((image) => image.decode().catch(() => {})));
  });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await page.locator('img').evaluateAll((images) => images.every((img) => img instanceof HTMLImageElement && img.complete && img.naturalWidth > 0))).toBe(true);
  expect(errors).toEqual([]);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: testInfo.outputPath('portfolio.png'), fullPage: true, scale: 'css',
    // Evita artefactos de capas fijas en capturas que exceden el viewport móvil.
    style: '.site-header { position: relative !important; } .skip-link { display: none !important; }',
  });
});

test('mobile navigation works with reduced motion', async ({ page, isMobile }) => {
  test.skip(!isMobile);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByLabel('Abrir navegación').click();
  await page.getByRole('navigation', { name: 'Navegación móvil' }).getByRole('link', { name: 'Tecnologías' }).click();
  await expect(page.getByRole('navigation', { name: 'Navegación móvil' })).toBeHidden();
  await expect(page).toHaveURL(/#tecnologias$/);
  await expect(page.getByRole('heading', { name: 'Las herramientas detrás de las ideas.' })).toBeInViewport();
});

test('theme persists and project actions point to their real destinations', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'Activar modo claro' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(248, 249, 254)');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(248, 249, 254)');
  await page.getByRole('button', { name: 'Activar modo oscuro' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  const cards = page.locator('.project-card');
  await expect(cards).toHaveCount(5);
  await expect(cards.getByRole('link', { name: /^Demo En Vivo/ })).toHaveCount(5);
  await expect(cards.getByRole('link', { name: /^Ver Código/ })).toHaveCount(5);
  await expect(cards.getByRole('link', { name: /^GitHub de Andres/ })).toHaveCount(5);
  await expect(page.getByRole('link', { name: 'Demo En Vivo de Barbería · Turnos' })).toHaveAttribute('href', 'https://barberia-ae.vercel.app/');
  await expect(page.getByRole('link', { name: 'Demo En Vivo de Registro de usuarios' })).toHaveAttribute('href', 'https://proyecto-registro-andres.vercel.app/');
});

test('marquee can be paused and respects the site motion control', async ({ page }) => {
  await page.goto('/');
  const track = page.locator('.marquee-track');
  await expect(track).toHaveCSS('animation-name', 'marquee');
  await page.getByRole('button', { name: 'Pausar movimiento' }).click();
  await expect(track).toHaveCSS('animation-play-state', 'paused');
  await page.getByRole('button', { name: 'Reanudar movimiento' }).click();
  await expect(page.locator('.marquee')).toHaveAttribute('data-paused', 'false');
  await page.getByRole('button', { name: 'Pausar animaciones', exact: true }).click();
  await expect(track).toHaveCSS('animation-name', 'none');
  await expect(page.locator('.marquee-copy')).toBeHidden();
  await expect(page.locator('.marquee-toggle')).toBeHidden();
});

test('card hover keeps ambient light and cursor without a spotlight', async ({ page, isMobile }) => {
  test.skip(isMobile);
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/gsap-ready/);
  for (const selector of ['.skill-card', '.project-card']) {
    const card = page.locator(selector).first();
    await card.scrollIntoViewIfNeeded();
    await expect(card).toHaveAttribute('data-scroll-state', 'visible');
    const background = await card.evaluate(el => getComputedStyle(el).backgroundImage);
    await card.hover({ position: { x: 80, y: 100 } });
    await expect(card).toHaveCSS('background-image', background);
    expect(background).toContain('radial-gradient');
    expect(await card.evaluate(el => ['::before', '::after'].map(pseudo => getComputedStyle(el, pseudo).content))).toEqual(['none', 'none']);
    await expect(card.locator('.card-ambient')).toBeVisible();
    await expect(page.locator('.cursor-aura')).toHaveCSS('opacity', '1');
  }
  await page.getByRole('button', { name: 'Pausar animaciones', exact: true }).click();
  await expect(page.locator('.cursor-aura')).toBeHidden();
});

// Each viewport/theme has its own timeout and artifacts; a slow capture must
// not consume the budget of every remaining responsive check.
for (const width of [320, 390, 768, 1440, 2560]) {
  for (const theme of ['dark', 'light'] as const) {
    test(`responsive layout at ${width}px in ${theme} mode`, async ({ page, isMobile }, testInfo) => {
      test.skip(isMobile);
      await page.setViewportSize({ width, height: 1000 });
      await page.goto('/');

      // Layout captures use the site's pause control. Full-motion behavior is
      // covered separately by the GSAP, cursor and ambient-light tests.
      await page.getByRole('button', { name: 'Pausar animaciones', exact: true }).click();
      await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
      if (theme === 'light') await page.getByRole('button', { name: 'Activar modo claro' }).click();
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);

      await page.evaluate(() => document.fonts.ready);
      for (const image of await page.locator('.project-preview img').all()) {
        await image.scrollIntoViewIfNeeded();
        await image.evaluate((element) => (element as HTMLImageElement).decode());
      }
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));

      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}px ${theme}`).toBe(true);
      const collisions = await page.locator('.header-inner').evaluate((header) => {
        const children = Array.from(header.children).filter((element) => getComputedStyle(element).display !== 'none');
        return children.some((element, index) => index > 0 && element.getBoundingClientRect().left < children[index - 1].getBoundingClientRect().right - 1);
      });
      expect(collisions, `header ${width}px ${theme}`).toBe(false);

      const screenshotOptions = { animations: 'disabled', scale: 'css' } as const;
      await page.screenshot({ ...screenshotOptions, path: testInfo.outputPath(`${width}-${theme}.png`), fullPage: true });
      if (width === 1440 || width === 390) {
        await page.screenshot({ ...screenshotOptions, path: testInfo.outputPath(`${width}-${theme}-hero.png`) });
        await page.locator('.project-card').first().scrollIntoViewIfNeeded();
        await page.screenshot({ ...screenshotOptions, path: testInfo.outputPath(`${width}-${theme}-project.png`) });
        await page.locator('.contact-form').scrollIntoViewIfNeeded();
        await page.screenshot({ ...screenshotOptions, path: testInfo.outputPath(`${width}-${theme}-contact.png`) });
      }
    });
  }
}


test('content remains available without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('.project-card')).toHaveCount(5);
  await expect(page.getByRole('link', { name: 'Demo En Vivo de Rick & Morty' })).toBeVisible();
  await context.close();
});

test('theme works before hydration and without localStorage', async ({ page }) => {
  await page.route('**/_next/static/**/*.js', (route) => route.abort());
  await page.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('Storage unavailable'); } }); });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Activar modo claro' }).click();
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(248, 249, 254)');
  await expect(page.getByRole('button', { name: 'Activar modo oscuro' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Activar modo oscuro' }).click();
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(8, 11, 18)');
});

for (const width of [320, 360, 390, 430, 640, 768, 820, 1024, 1280, 1440, 1920, 2560, 3440]) {
  test(`visible GSAP and card lighting at ${width}px in both themes`, async ({ page, isMobile }, testInfo) => {
    test.skip(isMobile);
    test.setTimeout(60_000);
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    for (const theme of ['dark', 'light']) {
      await page.goto('/');
      if (theme === 'light') await page.getByRole('button', { name: 'Activar modo claro' }).click();
      await expect(page.locator('html')).toHaveClass(/gsap-ready/);
      const skill = page.locator('.skill-card').first();
      await expect(skill).toHaveAttribute('data-scroll-state', 'hidden');
      await expect(skill).toHaveCSS('opacity', '0');
      await skill.scrollIntoViewIfNeeded();
      await expect(skill).toHaveAttribute('data-scroll-state', 'visible');
      await expect(skill).toHaveCSS('opacity', '1');
      await expect.poll(() => skill.evaluate(el => Math.abs(new DOMMatrixReadOnly(getComputedStyle(el).transform).m42))).toBeLessThan(.1);
      const project = page.locator('.project-card').first();
      await expect(project).toHaveCSS('opacity', '0');
      await project.scrollIntoViewIfNeeded();
      await expect(project).toHaveAttribute('data-scroll-state', 'visible');
      await expect(project).toHaveCSS('opacity', '1');
      await expect.poll(() => project.evaluate(el => Math.abs(new DOMMatrixReadOnly(getComputedStyle(el).transform).m42))).toBeLessThan(.1);
      await project.hover({ position: { x: 100, y: 120 } });
      await expect(page.locator('.cursor-aura')).toHaveCSS('opacity', '1');
      for (const card of [skill, project]) {
        expect(await card.evaluate(el => getComputedStyle(el).backgroundImage)).toContain('radial-gradient');
        expect(await card.evaluate(el => ['::before', '::after'].map(pseudo => getComputedStyle(el, pseudo).content))).toEqual(['none', 'none']);
        await expect(card.locator('.card-ambient')).toBeVisible();
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await project.locator('img').evaluate((image) => (image as HTMLImageElement).decode());
      await project.screenshot({ path: testInfo.outputPath(`${width}-${theme}-ambient.png`) });
      if (theme === 'light') await page.getByRole('button', { name: 'Activar modo oscuro' }).click();
    }
  });
}

test('touch screens show GSAP and ambient light without a mouse aura', async ({ page, isMobile }) => {
  test.skip(!isMobile);
  test.setTimeout(60_000);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  for (const width of [320, 390, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    for (const theme of ['dark', 'light']) {
      await page.goto(`/?touch=${width}-${theme}`);
      if (theme === 'light') await page.getByRole('button', { name: 'Activar modo claro' }).click();
      await expect(page.locator('html')).toHaveClass(/gsap-ready/);
      const card = page.locator('.skill-card').first();
      await card.scrollIntoViewIfNeeded();
      await expect(card).toHaveAttribute('data-scroll-state', 'visible');
      await expect(card).toHaveCSS('opacity', '1');
      expect(await card.evaluate(el => getComputedStyle(el).backgroundImage)).toContain('radial-gradient');
      await expect(page.locator('.cursor-aura')).toBeHidden();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      if (theme === 'light') await page.getByRole('button', { name: 'Activar modo oscuro' }).click();
    }
  }
});

test('contact panels and section headings reveal visibly on scroll', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/gsap-ready/);
  for (const selector of ['.projects-section .section-title-row', '.contact-copy', '.contact-form']) {
    const panel = page.locator(selector);
    await expect(panel).toHaveAttribute('data-scroll-state', /hidden|visible|revealing/);
    await panel.scrollIntoViewIfNeeded();
    await expect(panel).toHaveAttribute('data-scroll-state', 'visible');
    await expect(panel).toHaveCSS('opacity', '1');
  }
});

test('mouse aura disappears when the pointer leaves the page', async ({ page, isMobile }) => {
  test.skip(isMobile);
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/gsap-ready/);
  await page.mouse.move(200, 300);
  await expect(page.locator('.cursor-aura')).toHaveCSS('opacity', '1');
  await page.mouse.move(-20, -20);
  await expect(page.locator('.cursor-aura')).toHaveCSS('opacity', '0');
});

test('GSAP starts automatically with OS reduced motion and an old saved pause', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => localStorage.setItem('portfolio-motion', 'reduced'));
  await page.goto('/');
  expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true);
  await expect(page.locator('html')).toHaveAttribute('data-motion-version', '3');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'full');
  await expect(page.locator('html')).toHaveAttribute('data-motion-engine', 'gsap');
  const card = page.locator('.project-card').first();
  await expect(card).toHaveCSS('opacity', '0');
  await card.scrollIntoViewIfNeeded();
  await expect(card).toHaveAttribute('data-scroll-state', 'revealing');
  await expect(card).toHaveAttribute('data-scroll-state', 'visible');
  const orb = card.locator('.card-ambient i').first();
  const before = await orb.getAttribute('style');
  await expect.poll(() => orb.getAttribute('style')).not.toBe(before);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'full');
  await page.getByRole('button', { name: 'Pausar animaciones', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
  await expect(page.locator('html')).not.toHaveClass(/gsap-ready/);
  await expect(card).toHaveCSS('opacity', '1');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
  await page.getByRole('button', { name: 'Activar animaciones', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-motion-engine', 'gsap');
});
test('GSAP replays the card entry after scrolling back above a section', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/gsap-ready/);
  const card = page.locator('.project-card').first();
  await card.scrollIntoViewIfNeeded();
  await expect(card).toHaveAttribute('data-scroll-state', 'visible');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect(card).toHaveAttribute('data-scroll-state', 'hidden');
  await expect(card).toHaveCSS('opacity', '0');
  await card.scrollIntoViewIfNeeded();
  await expect(card).toHaveAttribute('data-scroll-state', 'revealing');
  await expect(card).toHaveAttribute('data-scroll-state', 'visible');
});

test('JavaScript assets are allowed from the address used to open the portfolio', async ({ page, request, baseURL, isMobile }) => {
  test.skip(isMobile);
  await page.goto('/');
  const scriptPath = await page.locator('script[src]').first().getAttribute('src');
  expect(scriptPath).toBeTruthy();
  const origin = new URL(baseURL!).origin;
  const response = await request.get(new URL(scriptPath!, baseURL).href, {
    headers: { Origin: origin, Referer: `${origin}/`, 'Sec-Fetch-Mode': 'no-cors', 'Sec-Fetch-Site': 'same-origin' },
  });
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('javascript');
  await expect(page.locator('html')).toHaveAttribute('data-motion-engine', 'gsap');
});
