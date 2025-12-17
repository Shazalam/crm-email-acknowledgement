import cloudinary from "../../../lib/cloudinary";
import { v4 as uuidv4 } from 'uuid';
import { baseLogger } from '../../utils/logger';
import { cleanBase64Image } from '../../utils/base64.util';
import { CloudinaryUploadResult } from '@/app/types/shared/docusign';

const UPLOAD_TIMEOUT = 60000;
const CHUNK_SIZE = 6_000_000;

export async function uploadBase64Image(
  base64: string,
  folder: string,
  retries = 0
): Promise<CloudinaryUploadResult | null> {
  const MAX_RETRIES = 3;
  const clean = cleanBase64Image(base64);

  if (!clean) return null;

  const buffer = Buffer.from(clean, 'base64');

 return new Promise((resolve, reject) => {
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
      (
        error: UploadApiErrorResponse | undefined,
        result: UploadApiResponse | undefined
      ) => {
        if (error || !result) {
          baseLogger.error('Cloudinary upload failed', { error });

          if (retries < MAX_RETRIES) {
            return resolve(uploadBase64Image(base64, folder, retries + 1));
          }
          return reject(error || new Error('Upload failed'));
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    stream.end(buffer);
  });
}
