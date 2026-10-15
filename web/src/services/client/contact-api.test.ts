import { afterEach, describe, expect, it, vi } from 'vitest';
import { sendContact } from './contact-api';

const input = { name: 'Andrea', email: 'andrea@example.com', message: 'Quiero conversar sobre una aplicación accesible.', website: '' };
afterEach(() => { vi.unstubAllGlobals(); });

describe('FormSubmit delivery', () => {
  it('sends named fields to the approved recipient and accepts the provider response', async () => {
    const fetch = vi.fn().mockResolvedValue(Response.json({ success: 'true' }));
    vi.stubGlobal('fetch', fetch);
    expect((await sendContact(input)).ok).toBe(true);
    const [url, options] = fetch.mock.calls[0];
    expect(url).toBe('https://formsubmit.co/ajax/gamerandres0102@gmail.com');
    expect(JSON.parse(options.body)).toMatchObject({ name: input.name, email: input.email, message: input.message });
    expect(options.signal).toBeInstanceOf(AbortSignal);
  });

  it.each([
    [200, { success: 'false' }], [429, { success: 'true' }], [200, {}], [200, null],
  ])('does not claim success for an unaccepted submission (%s)', async (status, body) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json(body, { status })));
    expect((await sendContact(input)).ok).toBe(false);
  });

  it('propagates network errors for the form to retain the message', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')));
    await expect(sendContact(input)).rejects.toThrow('offline');
  });

  it('does not deliver honeypot submissions', async () => {
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    await sendContact({ ...input, website: 'bot.example' });
    expect(fetch).not.toHaveBeenCalled();
  });
});
