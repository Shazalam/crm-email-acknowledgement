import { NextRequest } from 'next/server';
import type { RequestContext } from '@/lib/utils/apiResponse';

export function createRequestContext(request: NextRequest): RequestContext {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0] || request.headers.get('x-real-ip') || 'unknown';

  return {
    requestId:
      request.headers.get('x-request-id') ||
      `req_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    ipAddress: ip,
    userAgent: request.headers.get('user-agent') || 'unknown',
  };
}
