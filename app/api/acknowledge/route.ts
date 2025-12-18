import { created } from "@/lib/utils/apiResponse";
import connectDB from "@/lib/utils/db";
import { NextRequest } from "next/server";
import { createRequestContext } from "@/lib/helpers/backend-helpers/request-context.helper";
import { RequestValidator } from "@/lib/validators/request.validator";
import { saveAcknowledgeDocument } from "@/lib/services/docusign/acknowledge.service";

export async function POST(request: NextRequest) {
  const context = createRequestContext(request);

  const body = await request.json();

  RequestValidator.validateDocumentUpload(body);

  await connectDB();

  const customer = await saveAcknowledgeDocument(body);

  return created({
    customerId: customer._id.toString(),
    verificationStatus: customer.verificationStatus,
  });
}
              