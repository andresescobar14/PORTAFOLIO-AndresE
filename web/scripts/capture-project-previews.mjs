import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

// Solo lectura: no se envían formularios ni se escribe en los proyectos fuente.
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL ?? 'msedge', headless: true });
try {
  await mkdir('public/projects', { recursive: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  await page.goto('https://barberia-ae.vercel.app/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'public/projects/barberia.jpg', type: 'jpeg', quality: 85 });
  const response = await fetch('https://raw.githubusercontent.com/andresescobar14/proyecto-registro-andres/main/registro.html');
  if (!response.ok) throw new Error('No se pudo leer el formulario público.');
  await page.setContent(await response.text(), { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'public/projects/registro.jpg', type: 'jpeg', quality: 85 });
} finally {
  await browser.close();
}
