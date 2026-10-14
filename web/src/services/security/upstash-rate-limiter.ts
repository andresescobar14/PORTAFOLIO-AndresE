import 'server-only';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import type { RateLimiter } from '@/types/rate-limit';

let instance: Ratelimit | undefined;

export const contactRateLimiter: RateLimiter = {
  async check(identifier) {
    instance ??= new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(5, '60 s'),
      prefix: `portfolio:contact:${process.env.VERCEL_ENV ?? process.env.NODE_ENV}`,
      analytics: false,
      timeout: 1000,
    });
    const result = await instance.limit(identifier);
    if (result.reason === 'timeout') throw new Error('RATE_LIMIT_UNAVAILABLE');
    return { allowed: result.success, limit: result.limit, remaining: result.remaining, resetAt: result.reset };
  },
};
