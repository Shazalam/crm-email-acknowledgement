import { baseLogger } from './logger';

export function getRequestLogger(requestId?: string) {
  return baseLogger.child({
    requestId,
  });
}
