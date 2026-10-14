import { createContactHandler } from '@/domain/contact/contact-handler';
import { contactRateLimiter } from '@/services/security/upstash-rate-limiter';
import { getClientIp } from '@/services/security/client-ip';
import { deliverContact, isContactConfigured } from '@/services/server/contact-delivery';

export const runtime = 'nodejs';
export const maxDuration = 15;
export const POST = createContactHandler({
  limiter: contactRateLimiter,
  deliver: deliverContact,
  getClientIp,
  isConfigured: isContactConfigured,
});
