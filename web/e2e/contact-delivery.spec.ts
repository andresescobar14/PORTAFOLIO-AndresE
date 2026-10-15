import { test, expect } from '@playwright/test';

test('contact validates and submits to FormSubmit without leaving the portfolio', async ({ page }) => {
  let payload: Record<string, unknown> | undefined;
  await page.route('https://formsubmit.co/ajax/**', async route => {
    payload = route.request().postDataJSON();
    await route.fulfill({ json: { success: 'true' } });
  });
  await page.goto('/#contacto');
  await page.getByRole('button', { name: 'Enviar mensaje' }).click();
  await expect(page.getByLabel('Tu nombre')).toHaveAttribute('aria-invalid', 'true');
  expect(payload).toBeUndefined();
  await page.getByLabel('Tu nombre').fill('Andrea');
  await page.getByLabel('Tu correo').fill('andrea@example.com');
  await page.getByLabel('Cuéntame tu idea').fill('Me gustaría conversar sobre una aplicación web accesible.');
  await page.getByRole('button', { name: 'Enviar mensaje' }).click();
  await expect(page.locator('.form-success')).toContainText('Solicitud enviada');
  expect(payload).toMatchObject({ name: 'Andrea', email: 'andrea@example.com' });
  await expect(page.getByLabel('Tu nombre')).toHaveValue('');
  await expect(page).toHaveURL(/#contacto$/);
});

test('contact preserves the message when the delivery provider refuses it', async ({ page }) => {
  await page.route('https://formsubmit.co/ajax/**', route => route.fulfill({ status: 429, json: { success: 'false' } }));
  await page.goto('/#contacto');
  await page.getByLabel('Tu nombre').fill('Andrea');
  await page.getByLabel('Tu correo').fill('andrea@example.com');
  await page.getByLabel('Cuéntame tu idea').fill('Quiero crear una aplicación web accesible para mi equipo.');
  await page.getByRole('button', { name: 'Enviar mensaje' }).click();
  await expect(page.getByRole('form', { name: 'Formulario de contacto' }).getByRole('alert')).toContainText('No se pudo enviar');
  await expect(page.getByLabel('Cuéntame tu idea')).toHaveValue('Quiero crear una aplicación web accesible para mi equipo.');
  await expect(page.getByRole('button', { name: 'Enviar mensaje' })).toBeEnabled();
});
