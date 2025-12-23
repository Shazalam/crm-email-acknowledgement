import { NextRequest } from 'next/server';
import connectDB from '@/lib/utils/db';
import DocuSign from '@/models/DocuSign';
import { createRequestContext } from '@/lib/helpers/backend-helpers/request-context.helper';
import {
  success,
  badRequest,
  notFound,
  internalError,
  ErrorCode,
} from '@/lib/utils/apiResponse';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ bookingId: string }> }
) {
  const reqContext = createRequestContext(request);

  try {
    const { bookingId } = await context.params; // NOTE: await here

    if (!bookingId) {
      return badRequest(
        'Booking ID is required',
        ErrorCode.REQUIRED_FIELD,
        { field: 'bookingId' },
        reqContext
      );
    }

    await connectDB();

    const customer = await DocuSign.findOne({ bookingId }).lean();

    if (!customer) {
      return notFound(
        'Customer not found for this booking ID',
        ErrorCode.NOT_FOUND,
        { bookingId },
        reqContext
      );
    }

    return success(
      { customer },
      'Customer fetched successfully'
    );
  } catch (err: any) {
    console.error('GET /api/customers/[bookingId] error:', err);

    if (err?.name === 'MongoServerError') {
      return internalError(
        'Database error while fetching customer',
        ErrorCode.DATABASE_ERROR,
        { message: err.message },
        reqContext
      );
    }

    return internalError(
      'Unexpected error while fetching customer',
      ErrorCode.INTERNAL_ERROR,
      { message: err?.message, stack: err?.stack },
      reqContext
    );
  }
}
