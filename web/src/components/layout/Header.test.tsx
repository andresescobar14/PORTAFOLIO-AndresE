import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Header } from './Header';

describe('Header', () => {
  it('shows the supplied identity and accessible section navigation', () => {
    render(<Header fullName="Andrea Pérez" profession="Programadora Web Full-Stack" links={[
      { label: 'Proyectos', href: '#proyectos' },
      { label: 'Contacto', href: '#contacto' },
    ]} />);
    const header = screen.getByRole('banner');
    expect(within(header).getByText('Andrea Pérez')).toBeVisible();
    expect(within(header).getByText('Programadora Web Full-Stack')).toBeVisible();
    const navigation = within(header).getByRole('navigation', { name: 'Navegación principal' });
    expect(within(navigation).getByRole('link', { name: 'Proyectos' })).toHaveAttribute('href', '#proyectos');
    expect(within(header).getByRole('link', { name: /Hablemos/ })).toHaveAttribute('href', '#contacto');
  });
});
