// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { getClientIp } from './client-ip';

describe('trusted client IP', () => {
  it('does not trust an arbitrary forwarded header outside a configured proxy', () => {
    const request = new Request('https://site.test', { headers: { 'x-forwarded-for': '1.2.3.4', 'x-vercel-forwarded-for': '1.2.3.4' } });
    expect(getClientIp(request, { NODE_ENV: 'production' })).toBeUndefined();
  });
  it('uses the platform header and normalizes IPv6', () => {
    const request = new Request('https://site.test', { headers: { 'x-vercel-forwarded-for': '2001:0db8:0000:0000:0000:0000:0000:0001' } });
    expect(getClientIp(request, { VERCEL: '1' })).toBe('2001:db8::1');
  });
  it('rejects a malformed platform IP', () => {
    const request = new Request('https://site.test', { headers: { 'x-vercel-forwarded-for': 'not-an-ip' } });
    expect(getClientIp(request, { VERCEL: '1' })).toBeUndefined();
  });
});
