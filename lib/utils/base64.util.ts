import { baseLogger } from "./logger";


export function cleanBase64Image(base64: string): string | null {
  try {
    const clean = base64.replace(/^data:image\/\w+;base64,/, '');

    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(clean)) {
      baseLogger.warn('Invalid base64 format');
      return null;
    }

    return clean;
  } catch (err) {
    baseLogger.error('Base64 validation failed', { err });
    return null;
  }
}
