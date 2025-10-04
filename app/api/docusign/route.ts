// app/api/docusign/route.ts
import { NextRequest, NextResponse } from "next/server";
import connect from "../../../lib/db";
import Customer, { ICustomer } from "../../../models/Customer";
import cloudinary from "../../../lib/cloudinary";
import { v4 as uuidv4 } from "uuid";
import type { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

// 🔹 Helper to upload base64 images to Cloudinary
async function uploadBase64(
  base64str: string,
  folder = "docusign"
): Promise<{ url: string; public_id: string } | null> {
  if (!base64str) return null;

  const matches = base64str.match(/^data:(image\/\w+);base64,(.+)$/);
  const payload = matches ? matches[2] : base64str;
  const buffer = Buffer.from(payload, "base64");

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image", public_id: `${uuidv4()}` },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error || !result) return reject(error);
        resolve({ url: result.secure_url, public_id: result.public_id });
      }
    );
    stream.end(buffer);
  });
}

type DocusignResponse = {
  ok: boolean;
  customerId?: string;
  bookingId?: string | null;
  acknowledged?: boolean;
  message?: string;
};

export async function POST(req: NextRequest): Promise<NextResponse<DocusignResponse>> {
  try {
    const body = await req.json();

    await connect();

    let customer: ICustomer | null = null;

    if (!customer && body.sessionId) {
      customer = await Customer.findOne({ sessionId: body.sessionId });
    }
    if (!customer && body.bookingId) {
      customer = await Customer.findOne({ bookingId: body.bookingId });
    }

    const front = body.frontImageBase64
      ? await uploadBase64(body.frontImageBase64, "docusign/front")
      : null;
    const back = body.backImageBase64
      ? await uploadBase64(body.backImageBase64, "docusign/back")
      : null;

    if (!customer) {
      customer = await Customer.create({
        sessionId: body.sessionId || uuidv4(),
        bookingId: body.bookingId || null,
        device: body.device,
        browser: body.browser,
        os: body.os,
        ip: body.ip,
        location: body.location,
        acknowledged: body.acknowledged || false,
        frontImage: front?.url,
        backImage: back?.url,
      });
    } else {
      if (front) customer.frontImage = front.url;
      if (back) customer.backImage = back.url;
      await customer.save();
    }
    console.log("✅ Docusign data saved for customer:", customer);

    if (!customer) {
      return NextResponse.json(
        { ok: false, message: "Customer creation failed" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        customerId: customer._id.toString(),
        bookingId: customer.bookingId?.toString() || null,
        acknowledged: customer.acknowledged,
      },
      { status: 200 }
    );

  } catch (err) {
    console.error("❌ docusign error", err);

    const message = err instanceof Error ? err.message : "An unexpected error occurred";

    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
