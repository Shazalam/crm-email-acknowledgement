// lib/services/docusign/acknowledge.service.ts
import Customer from '@/models/DocuSign';
import { v4 as uuidv4 } from 'uuid';
import type { DocusignRequestBody } from '@/app/types/shared/docusign';
import { normalizeLocation } from '@/lib/helpers/backend-helpers/location.helper';

export async function saveAcknowledgeDocument(
  body: DocusignRequestBody,
) {

  const existing = await Customer.findOne({ bookingId: body.bookingId });

  const basePayload = {
    bookingId: body.bookingId,
    device: body.device ?? 'unknown',
    browser: body.browser ?? 'unknown',
    os: body.os ?? 'unknown',
    ip: body.ip ?? 'unknown',
    location: normalizeLocation(body.location),
    acknowledged: body.acknowledged ?? false,
    // uploadedAt: new Date(),
  };

  if (!existing) {
    const insertPayload = {
      ...basePayload,
      sessionId: uuidv4(),
      frontImage: '',
      backImage: '',
      // verificationStatus: 'pending',
    };

    return Customer.findOneAndUpdate(
      { bookingId: body.bookingId },
      { $set: insertPayload },
      { new: true, upsert: true }
    );
  }

  // Only update non-image fields; keep existing images & status
  const updatePayload = {
    ...basePayload,
    frontImage: existing.frontImage,
    backImage: existing.backImage,
    // verificationStatus: existing.verificationStatus ?? 'pending',
  };

  return Customer.findOneAndUpdate(
    { bookingId: body.bookingId },
    { $set: updatePayload },
    { new: true, upsert: true }
  );
}
