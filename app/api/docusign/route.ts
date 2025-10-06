// // app/api/docusign/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import connect from "../../../lib/db";
// import Customer, { ICustomer } from "../../../models/Customer";
// import cloudinary from "../../../lib/cloudinary";
// import { v4 as uuidv4 } from "uuid";
// import type { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

// // 🔹 Helper to upload base64 images to Cloudinary
// async function uploadBase64(
//   base64str: string,
//   folder = "docusign"
// ): Promise<{ url: string; public_id: string } | null> {
//   if (!base64str) return null;

//   const matches = base64str.match(/^data:(image\/\w+);base64,(.+)$/);
//   const payload = matches ? matches[2] : base64str;
//   const buffer = Buffer.from(payload, "base64");

//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       { folder, resource_type: "image", public_id: `${uuidv4()}` },
//       (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
//         if (error || !result) return reject(error);
//         resolve({ url: result.secure_url, public_id: result.public_id });
//       }
//     );
//     stream.end(buffer);
//   });
// }

// type DocusignResponse = {
//   ok: boolean;
//   customerId?: string;
//   bookingId?: string | null;
//   acknowledged?: boolean;
//   message?: string;
// };

// export async function POST(req: NextRequest): Promise<NextResponse<DocusignResponse>> {
//   try {
//     const body = await req.json();

//     await connect();

//     let customer: ICustomer | null = null;

//     if (!customer && body.sessionId) {
//       customer = await Customer.findOne({ sessionId: body.sessionId });
//     }
//     if (!customer && body.bookingId) {
//       customer = await Customer.findOne({ bookingId: body.bookingId });
//     }

//     const front = body.frontImageBase64
//       ? await uploadBase64(body.frontImageBase64, "docusign/front")
//       : null;
//     const back = body.backImageBase64
//       ? await uploadBase64(body.backImageBase64, "docusign/back")
//       : null;

//     if (!customer) {
//       customer = await Customer.create({
//         sessionId: body.sessionId || uuidv4(),
//         bookingId: body.bookingId || null,
//         device: body.device,
//         browser: body.browser,
//         os: body.os,
//         ip: body.ip,
//         location: body.location,
//         acknowledged: body.acknowledged || false,
//         frontImage: front?.url,
//         backImage: back?.url,
//       });
//     } else {
//       if (front) customer.frontImage = front.url;
//       if (back) customer.backImage = back.url;
//       await customer.save();
//     }
//     console.log("✅ Docusign data saved for customer:", customer);

//     if (!customer) {
//       return NextResponse.json(
//         { ok: false, message: "Customer creation failed" },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json(
//       {
//         ok: true,
//         customerId: customer._id.toString(),
//         bookingId: customer.bookingId?.toString() || null,
//         acknowledged: customer.acknowledged,
//       },
//       { status: 200 }
//     );

//   } catch (err) {
//     console.error("❌ docusign error", err);

//     const message = err instanceof Error ? err.message : "An unexpected error occurred";

//     return NextResponse.json({ ok: false, message }, { status: 500 });
//   }
// }



import { NextRequest, NextResponse } from "next/server";
import connect from "../../../lib/db";
import Customer, { ICustomer } from "../../../models/Customer";
import cloudinary from "../../../lib/cloudinary";
import { v4 as uuidv4 } from "uuid";
import type { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";
import mongoose from "mongoose";

// Improved base64 upload with better error handling
async function uploadBase64(
  base64str: string,
  folder = "docusign"
): Promise<{ url: string; public_id: string } | null> {
  if (!base64str) return null;

  try {
    // Clean the base64 string
    const cleanBase64 = base64str.replace(/^data:image\/\w+;base64,/, '');

    // Validate base64 string
    if (!cleanBase64.match(/^[A-Za-z0-9+/]*={0,2}$/)) {
      throw new Error('Invalid base64 string');
    }

    const buffer = Buffer.from(cleanBase64, 'base64');

    return new Promise((resolve, reject) => {
      const uploadOptions = {
        folder,
        resource_type: "image" as const,
        public_id: `${uuidv4()}`,
        timeout: 60000, // 60 second timeout
        chunk_size: 6000000 // 6MB chunks
      };

      const stream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            console.error('Cloudinary upload error:', error);
            return reject(error || new Error('Upload failed'));
          }
          resolve({ url: result.secure_url, public_id: result.public_id });
        }
      );

      stream.on('error', (error) => {
        console.error('Stream error:', error);
        reject(error);
      });

      stream.end(buffer);
    });
  } catch (error) {
    console.error('Base64 upload error:', error);
    return null;
  }
}

// Type definitions for request body
interface LocationData {
  country: string;
  region: string;
  city: string;
  zipcode: string;
  accuracy: string;
  fullAddress: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface DocusignRequestBody {
  sessionId?: string;
  bookingId?: string | null; // ✅ Allow null explicitly
  acknowledged: boolean;
  frontImageBase64?: string | "";
  backImageBase64?: string | "";
  device: string;
  browser: string;
  os: string;
  ip: string;
  location: LocationData;
  userAgent: string;
  screenResolution: string;
  timezone: string;
  language: string;
  locationPermission: string;
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
    const body: DocusignRequestBody = await req.json();

    console.log("📥 Received docusign request:", {
      bookingId: body.bookingId,
      hasFront: !!body.frontImageBase64,
      hasBack: !!body.backImageBase64,
      acknowledged: body.acknowledged,
      location: body.location,
      ip: body.ip,
      device: body.device,
      browser: body.browser,
      os: body.os
    });

    await connect();

    let customer: ICustomer | null = null;

    // Find existing customer
    if (body.bookingId) {
      customer = await Customer.findOne({ bookingId: body.bookingId });
    }

    // Upload images only if they exist
    const [front, back] = await Promise.all([
      body.frontImageBase64 ? uploadBase64(body.frontImageBase64, "docusign/front") : Promise.resolve(null),
      body.backImageBase64 ? uploadBase64(body.backImageBase64, "docusign/back") : Promise.resolve(null),
    ]);

    console.log("📸 Upload results:", { front: !!front, back: !!back });

    // Prepare location data with ALL fields - FIXED VERSION
    const locationData: LocationData = {
      country: body.location?.country || 'Unknown',
      region: body.location?.region || 'Unknown',
      city: body.location?.city || 'Unknown',
      zipcode: body.location?.zipcode || 'Unknown',
      accuracy: body.location?.accuracy || 'Unknown',
      fullAddress: body.location?.fullAddress || 'Unknown'
    };

    // Add coordinates if they exist
    if (body.location?.coordinates) {
      locationData.coordinates = {
        lat: body.location.coordinates.lat,
        lng: body.location.coordinates.lng // Keep lng as is for MongoDB
      };
    }

    console.log("📍 Location data to store:", JSON.stringify(locationData, null, 2));

    const customerData = {
      sessionId: uuidv4(),
       bookingId: body.bookingId ? new mongoose.Types.ObjectId(body.bookingId) : undefined,
      device: body.device || 'unknown',
      browser: body.browser || 'unknown',
      os: body.os || 'unknown',
      ip: body.ip || 'unknown',
      location: locationData,
      acknowledged: body.acknowledged || false,
      frontImage: front?.url || "",
      backImage: back?.url || "",
      // Store additional metadata
      userAgent: body.userAgent,
      screenResolution: body.screenResolution,
      timezone: body.timezone,
      language: body.language,
      locationPermission: body.locationPermission
    };

    if (!customer) {
      // Create new customer with all location data
      console.log("🆕 Creating new customer with data:", JSON.stringify(customerData, null, 2));
      customer = await Customer.create(customerData);
    } else {
      // Update existing customer - update all fields including location
      console.log("🔄 Updating existing customer with data:", JSON.stringify(customerData, null, 2));

      customer.device = body.device || customer.device;
      customer.browser = body.browser || customer.browser;
      customer.os = body.os || customer.os;
      customer.ip = body.ip || customer.ip;
      customer.location = locationData;
      customer.acknowledged = body.acknowledged || customer.acknowledged;

      // Update images if provided
      if (front) customer.frontImage = front.url;
      if (back) customer.backImage = back.url;

      // Update additional metadata
      customer.userAgent = body.userAgent || customer.userAgent;
      customer.screenResolution = body.screenResolution || customer.screenResolution;
      customer.timezone = body.timezone || customer.timezone;
      customer.language = body.language || customer.language;
      customer.locationPermission = body.locationPermission || customer.locationPermission;

      await customer.save();
    }

    if (customer) {
      // Refresh customer only if exists
      customer = await Customer.findById(customer._id);
    }

    if (!customer) {
      return NextResponse.json(
        { ok: false, message: "Customer creation failed" },
        { status: 500 }
      );
    }

    console.log("✅ Docusign data saved for customer:", {
      id: customer._id,
      bookingId: customer.bookingId,
      location: customer.location,
      ip: customer.ip,
      acknowledged: customer.acknowledged
    });

    // Log the complete stored document for verification
    console.log("📊 Complete stored customer data:", JSON.stringify(customer.toObject(), null, 2));

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
    console.error("❌ Docusign error:", err);
    const message = err instanceof Error ? err.message : "An unexpected error occurred";

    return NextResponse.json({
      ok: false,
      message
    }, { status: 500 });
  }
}