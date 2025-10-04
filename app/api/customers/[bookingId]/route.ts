// app/api/customers/[bookingId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connect from '../../../../lib/db';
import Customer, {ICustomer} from '../../../../models/Customer';

type CustomerResponse = {
  ok: boolean;
  customer?: ICustomer | null;
  message?: string;
};

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ bookingId: string }> }
): Promise<NextResponse<CustomerResponse>> {
  try {
    await connect();

    // ✅ resolve params safely
    const { bookingId } = await context.params;

    if (!bookingId) {
      return NextResponse.json(
        { ok: false, message: 'Booking ID is required' },
        { status: 400 }
      );
    }

    // Find customer by bookingId (ObjectId string)
    const customer = await Customer.findOne({ bookingId }).lean<ICustomer>();

    if (!customer) {
      return NextResponse.json(
        { ok: false, message: 'Customer not found for this booking ID' },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, customer }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch customer by bookingId:', error);

    const message =
      error instanceof Error ? error.message : 'An unexpected error occurred';

    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
