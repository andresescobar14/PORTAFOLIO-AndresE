import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ContactForm } from './ContactForm';

describe('ContactForm', () => {
  it('communicates unavailable delivery without pretending to send', () => {
    render(<ContactForm enabled={false} />);
    expect(screen.getByRole('button', { name: /Enviar mensaje/ })).toBeDisabled();
    expect(screen.getByText(/El formulario estará disponible pronto/)).toBeVisible();
  });

  it('shows a successful result after the injected service completes', async () => {
    const user = userEvent.setup();
    const send = vi.fn().mockResolvedValue({ ok: true, message: 'Mensaje enviado. Gracias por escribir.' });
    render(<ContactForm enabled send={send} />);
    await user.type(screen.getByLabelText('Tu nombre'), 'Andrea');
    await user.type(screen.getByLabelText('Tu correo'), 'andrea@example.com');
    await user.type(screen.getByLabelText('Cuéntame tu idea'), 'Me gustaría construir una aplicación web.');
    await user.click(screen.getByRole('button', { name: /Enviar mensaje/ }));
    expect(await screen.findByRole('status')).toHaveTextContent('Mensaje enviado');
    expect(send).toHaveBeenCalledOnce();
    expect(screen.getByLabelText('Tu nombre')).toHaveValue('');
  });

  it('preserves the message and announces service errors', async () => {
    const user = userEvent.setup();
    const send = vi.fn().mockResolvedValue({ ok: false, message: 'Espera 60 segundos antes de reintentar.' });
    render(<ContactForm enabled send={send} />);
    await user.type(screen.getByLabelText('Tu nombre'), 'Andrea');
    await user.type(screen.getByLabelText('Tu correo'), 'andrea@example.com');
    await user.type(screen.getByLabelText('Cuéntame tu idea'), 'Me gustaría construir una aplicación web.');
    await user.click(screen.getByRole('button', { name: /Enviar mensaje/ }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Espera 60 segundos');
    expect(screen.getByLabelText('Tu nombre')).toHaveValue('Andrea');
  });
});
