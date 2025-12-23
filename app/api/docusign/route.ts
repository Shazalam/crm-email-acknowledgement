// src/app/api/docusign/route.ts
import { NextRequest } from "next/server";
import { uploadBase64Image } from "@/lib/helpers/backend-helpers/cloudinary.helper";
import { saveDocusignDocument } from "@/lib/services/docusign/docusign.service";
import connectDB from "@/lib/utils/db";
import { createRequestContext } from "@/lib/helpers/backend-helpers/request-context.helper";
import { RequestValidator } from "@/lib/validators/request.validator";
import {
  created,
  internalError,
  validationError,
  ErrorCode,
} from "@/lib/utils/apiResponse";

export async function POST(request: NextRequest) {
  const context = createRequestContext(request);

  try {
    const body = await request.json();

    // 1. Input validation (schema / DTO level)
    try {
      RequestValidator.validateDocumentUpload(body);
    } catch (err: any) {
      // If your validator already returns a structured error:
      const details = err?.errors ?? { body: ["Invalid document upload payload"] };
      return validationError(details, "Validation failed for document upload", context);
    }

    await connectDB();

    // 2. Image uploads in parallel
    const [front, back] = await Promise.all([
      body.frontImageBase64
        ? uploadBase64Image(body.frontImageBase64, "docusign/front")
        : null,
      body.backImageBase64
        ? uploadBase64Image(body.backImageBase64, "docusign/back")
        : null,
    ]);

    // 3. Call domain service
    const customer = await saveDocusignDocument(body, front, back);

    if (!customer) {
      // Extremely rare (upsert failed)
      return internalError(
        "Failed to save docusign document",
        ErrorCode.DATABASE_ERROR,
        { bookingId: body.bookingId },
        context
      );
    }

    // 4. Success response
    return created(
      {
        customerId: customer._id.toString(),
        // verificationStatus: customer.verificationStatus,
      },
      "Document uploaded successfully",
      {
        timestamp: new Date().toISOString(),
        version: process.env.APP_VERSION || "1.0.0",
        requestId: context.requestId,
      }
    );


  } catch (err: any) {

    // If your validator throws plain Error with a specific message, you can map by message:
    if (err?.name === "MongoServerError") {
      return internalError(
        "Database error while saving document",
        ErrorCode.DATABASE_ERROR,
        { message: err.message },
        context
      );
    }

    return internalError(
      "Unexpected error while uploading document",
      ErrorCode.INTERNAL_ERROR,
      { message: err?.message, stack: err?.stack },
      context
    );
  }
}
