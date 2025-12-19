// app/api/docusign/acknowledge/route.ts
import { NextRequest } from 'next/server';
import connectDB from '@/lib/utils/db';
import { createRequestContext } from '@/lib/helpers/backend-helpers/request-context.helper';
import { RequestValidator } from '@/lib/validators/request.validator';
import {
  created,
  validationError,
  internalError,
  ErrorCode,
} from '@/lib/utils/apiResponse';
import { saveAcknowledgeDocument } from '@/lib/services/docusign/acknowledge.service';

export async function POST(request: NextRequest) {
  const context = createRequestContext(request);

  try {
    const body = await request.json();

    // You may want a dedicated validator, e.g. validateAcknowledge
    try {
      RequestValidator.validateDocumentUpload(body);
    } catch (err: any) {
      const details = err?.errors ?? { body: ['Invalid acknowledge payload'] };
      return validationError(details, 'Validation failed', context);
    }

    await connectDB();

    const customer = await saveAcknowledgeDocument(body);

    if (!customer) {
      return internalError(
        'Failed to save acknowledgement',
        ErrorCode.DATABASE_ERROR,
        { bookingId: body.bookingId },
        context
      );
    }

    return created(
      {
        customerId: customer._id.toString(),
        // verificationStatus: customer.verificationStatus,
      },
      'Acknowledgement saved successfully'
    );
  } catch (err: any) {
    console.error('POST /api/docusign/acknowledge error:', err);

    return internalError(
      'Unexpected error while saving acknowledgement',
      ErrorCode.INTERNAL_ERROR,
      { message: err?.message, stack: err?.stack },
      context
    );
  }
}
