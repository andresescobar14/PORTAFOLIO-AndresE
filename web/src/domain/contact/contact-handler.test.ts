// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createContactHandler } from './contact-handler';

const payload = { name: 'Andrea Pérez', email: 'andrea@example.com', message: 'Quiero conversar sobre una nueva aplicación web.', website: '' };
const request = (body: unknown = payload, headers: Record<string, string> = {}) => new Request('https://portfolio.test/api/contact', {
  method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://portfolio.test', ...headers }, body: JSON.stringify(body),
});

describe('contact handler', () => {
  const check = vi.fn();
  const deliver = vi.fn();
  const getClientIp = vi.fn();
  const isConfigured = vi.fn();
  const handler = createContactHandler({ limiter: { check }, deliver, getClientIp, isConfigured });

  beforeEach(() => {
    check.mockResolvedValue({ allowed: true, limit: 5, remaining: 4, resetAt: Date.now() + 60_000 });
    deliver.mockResolvedValue(undefined);
    getClientIp.mockReturnValue('203.0.113.10');
    isConfigured.mockReturnValue(true);
  });

  it('delivers a validated message after checking the IP', async () => {
    expect((await handler(request())).status).toBe(200);
    expect(check).toHaveBeenCalledWith('203.0.113.10');
    expect(deliver).toHaveBeenCalledWith(payload);
  });

  it('blocks an exhausted quota before delivering', async () => {
    check.mockResolvedValue({ allowed: false, limit: 5, remaining: 0, resetAt: Date.now() + 60_000 });
    const result = await handler(request());
    expect(result.status).toBe(429);
    expect(Number(result.headers.get('Retry-After'))).toBeGreaterThan(0);
    expect(deliver).not.toHaveBeenCalled();
  });

  it('rejects an invalid email', async () => {
    expect((await handler(request({ ...payload, email: 'invalid' }))).status).toBe(400);
    expect(deliver).not.toHaveBeenCalled();
  });

  it('rejects a cross-origin submission', async () => {
    expect((await handler(request(payload, { Origin: 'https://other.test' }))).status).toBe(403);
    expect(check).not.toHaveBeenCalled();
    expect(deliver).not.toHaveBeenCalled();
  });

  it('enforces the actual byte limit without trusting Content-Length', async () => {
    expect((await handler(request({ ...payload, message: 'x'.repeat(9000) }))).status).toBe(413);
    expect(deliver).not.toHaveBeenCalled();
  });

  it('rejects malformed JSON', async () => {
    const malformed = new Request('https://portfolio.test/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{broken' });
    expect((await handler(malformed)).status).toBe(400);
  });

  it('fails closed when the limiter is unavailable', async () => {
    check.mockRejectedValue(new Error('redis unavailable'));
    expect((await handler(request())).status).toBe(503);
    expect(deliver).not.toHaveBeenCalled();
  });

  it('fails closed when the trusted IP is unavailable', async () => {
    getClientIp.mockReturnValue(undefined);
    expect((await handler(request())).status).toBe(503);
    expect(deliver).not.toHaveBeenCalled();
  });

  it('does not claim success when delivery is unconfigured or fails', async () => {
    isConfigured.mockReturnValue(false);
    expect((await handler(request())).status).toBe(503);
    expect(deliver).not.toHaveBeenCalled();
    isConfigured.mockReturnValue(true);
    deliver.mockRejectedValue(new Error('provider error'));
    expect((await handler(request())).status).toBe(503);
  });

  it('silently discards honeypot submissions', async () => {
    expect((await handler(request({ ...payload, website: 'spam.test' }))).status).toBe(202);
    expect(deliver).not.toHaveBeenCalled();
  });
});
