import Customer from '@/models/DocuSign';
import { v4 as uuidv4 } from 'uuid';
import type { DocusignRequestBody } from '@/app/types/shared/docusign';
import { normalizeLocation } from '@/lib/helpers/backend-helpers/location.helper';

export async function saveAcknowledgeDocument(
    body: DocusignRequestBody,
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
        uploadedAt: new Date(),
        // verificationStatus: 'pending',
    };

    // 2. If no existing doc → upsert with whatever we have
    if (!existing) {
        const insertPayload = {
            ...basePayload,
            frontImage: '',
            backImage: '',
        };

        return Customer.findOneAndUpdate(
            { bookingId: body.bookingId },
            { $set: insertPayload },
            { new: true, upsert: true }
        );
    }

    return Customer.findOneAndUpdate(
        { bookingId: body.bookingId },
        basePayload,
        { new: true, upsert: true }
    );

}
