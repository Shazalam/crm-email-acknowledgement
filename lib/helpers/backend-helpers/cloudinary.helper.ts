import { v4 as uuidv4 } from 'uuid';

import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { baseLogger } from '@/lib/utils/logger';
import { cleanBase64Image } from '@/lib/utils/base64.util';
import { CloudinaryUploadResult } from '@/app/types/shared/docusign';
import cloudinary from '@/lib/utils/cloudinary';

const UPLOAD_TIMEOUT = 60_000;
const CHUNK_SIZE = 6_000_000;
const MAX_RETRIES = 3;

export async function uploadBase64Image(
  base64: string,
  folder: string,
  retries = 0
): Promise<CloudinaryUploadResult | null> {
  try {
    const clean = cleanBase64Image(base64);
    if (!clean) return null;

    const buffer = Buffer.from(clean, 'base64');

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: uuidv4(),
          resource_type: 'image',
          timeout: UPLOAD_TIMEOUT,
          chunk_size: CHUNK_SIZE,
          overwrite: true,
          quality: 'auto:good',
          fetch_format: 'auto',
        },
        (error?: UploadApiErrorResponse, result?: UploadApiResponse) => {
          if (error || !result) {
            return reject(error || new Error('Cloudinary upload failed'));
          }
          resolve(result);
        }
      );

      stream.end(buffer);
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    baseLogger.error('Cloudinary upload failed', {
      error,
      retries,
      folder,
    });

    if (retries < MAX_RETRIES) {
      return uploadBase64Image(base64, folder, retries + 1);
    }

    throw error;
  }
}
