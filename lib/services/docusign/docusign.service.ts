import Customer from '@/models/DocuSign';
import { v4 as uuidv4 } from 'uuid';
import type { CloudinaryUploadResult, DocusignRequestBody } from '@/app/types/shared/docusign';
import { normalizeLocation } from '@/lib/helpers/backend-helpers/location.helper';

export async function saveDocusignDocument(
  body: DocusignRequestBody,
  front: CloudinaryUploadResult | null,
  back: CloudinaryUploadResult | null
) {
  // 1. Check if doc already exists
  const existing = await Customer.findOne({ bookingId: body.bookingId });

  // Base payload (fields that always update)
  const basePayload = {
    sessionId: uuidv4(),
    bookingId: body.bookingId,
    device: body.device ?? 'unknown',
    browser: body.browser ?? 'unknown',
    os: body.os ?? 'unknown',
    ip: body.ip ?? 'unknown',
    location: normalizeLocation(body.location),
    acknowledged: body.acknowledged ?? false,
    // uploadedAt: new Date(),
    // verificationStatus: 'pending',
  };

  // 2. If no existing doc → upsert with whatever we have
  if (!existing) {
    const insertPayload = {
      ...basePayload,
      frontImage: front?.url ?? '',
      backImage: back?.url ?? '',
    };

    return Customer.findOneAndUpdate(
      { bookingId: body.bookingId },
      { $set: insertPayload },
      { new: true, upsert: true }
    );
  }

  // 3. Existing doc found
  const hasNewFront = !!front?.url;
  const hasNewBack = !!back?.url;
  const hasBothNewImages = hasNewFront && hasNewBack;

  if (hasBothNewImages) {
    // 3.a Both images provided → replace whole document (images + rest)
    const fullUpdatePayload = {
      ...basePayload,
      frontImage: front!.url,
      backImage: back!.url,
    };

    return Customer.findOneAndUpdate(
      { bookingId: body.bookingId },
      { $set: fullUpdatePayload },
      { new: true, upsert: true }
    );
  }

  // 3.b Not both images provided → keep existing images, update other fields only
  const partialUpdatePayload = {
    ...basePayload,
    // keep old images
    frontImage: existing.frontImage,
    backImage: existing.backImage,
  };

  // Optionally: if you want to update a single image when only that one comes:
  if (hasNewFront) partialUpdatePayload.frontImage = front!.url;
  if (hasNewBack)  partialUpdatePayload.backImage = back!.url;

  return Customer.findOneAndUpdate(
    { bookingId: body.bookingId },
    { $set: partialUpdatePayload },
    { new: true, upsert: true }
  );
}
