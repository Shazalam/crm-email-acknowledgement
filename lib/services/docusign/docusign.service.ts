import Customer from '@/models/DocuSign';
import { v4 as uuidv4 } from 'uuid';
import type { CloudinaryUploadResult, DocusignRequestBody } from '@/app/types/shared/docusign';
import { normalizeLocation } from '@/lib/helpers/backend-helpers/location.helper';

export async function saveDocusignDocument(
  body: DocusignRequestBody,
  front: CloudinaryUploadResult | null,
  back: CloudinaryUploadResult | null
) {
  const payload = {
    sessionId: uuidv4(),
    bookingId: body.bookingId,
    device: body.device ?? 'unknown',
    browser: body.browser ?? 'unknown',
    os: body.os ?? 'unknown',
    ip: body.ip ?? 'unknown',
    location: normalizeLocation(body.location),
    acknowledged: body.acknowledged ?? false,
    frontImage: front?.url ?? '',
    backImage: back?.url ?? '',
    uploadedAt: new Date(),
    verificationStatus: 'pending',
  };

  return Customer.findOneAndUpdate(
    { bookingId: body.bookingId },
    payload,
    { new: true, upsert: true }
  );
}
