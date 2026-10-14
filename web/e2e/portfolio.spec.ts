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
  await expect(page.getByRole('button', { name: 'Enviar mensaje' })).toBeDisabled();
  await expect(page.getByText('El formulario estará disponible pronto.', { exact: false })).toBeVisible();
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

test('the API reports unavailable delivery honestly and disallows other origins', async ({ request }) => {
  const response = await request.post('/api/contact', { data: { name: 'Test', email: 'test@example.com', message: 'Mensaje de prueba que no debe enviarse.', website: '' } });
  expect(response.status()).toBe(503);
  expect((await response.json()).ok).toBe(false);
  const crossOrigin = await request.post('/api/contact', { headers: { Origin: 'https://invalid.test' }, data: {} });
  expect(crossOrigin.status()).toBe(403);
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
