import { z } from 'zod';

const documentUploadSchema = z.object({
  bookingId: z.string().nullable().optional(),
  acknowledged: z.boolean(),

  frontImageBase64: z.string().nullable().optional(),
  backImageBase64: z.string().nullable().optional(),

  device: z.string(),
  browser: z.string(),
  os: z.string(),
  ip: z.string(),

  location: z.object({
    country: z.string(),
    region: z.string(),
    city: z.string(),
    zipcode: z.string(),
    accuracy: z.string(),
    fullAddress: z.string(),
    coordinates: z
      .object({
        lat: z.number(),
        lng: z.number(),
      })
      .optional(),
  }),

  userAgent: z.string(),
  screenResolution: z.string(),
  timezone: z.string(),
  language: z.string(),
  // locationPermission: z.enum(['granted', 'denied', 'prompt']),
});

export class RequestValidator {
  static validateDocumentUpload(body: unknown) {
    const result = documentUploadSchema.safeParse(body);

    if (!result.success) {
      const message = result.error.issues
        .map(issue => issue.message)
        .join(', ');

      throw new Error(`Invalid request body: ${message}`);
    }
    return result.data;
  }
}
