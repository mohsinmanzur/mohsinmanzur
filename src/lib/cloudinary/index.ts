import { v2 as cloudinary, type UploadApiResponse, type UploadApiOptions } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const CLOUDINARY_ROOT_FOLDER = "event-vendors";

export type SupportedModelFolder =
  | "users"
  | "events"
  | "projects"
  | "profiles"
  | "documents"
  | (string & {});

/**
 * Uploads a file (base64, remote URL, or file path) to Cloudinary
 * nested under event-vendors/<modelName>
 */
export async function uploadToCloudinary(
  file: string,
  modelName: SupportedModelFolder,
  options?: UploadApiOptions
): Promise<UploadApiResponse> {
  const folder = `${CLOUDINARY_ROOT_FOLDER}/${modelName}`;
  return await cloudinary.uploader.upload(file, {
    folder,
    resource_type: "auto",
    ...options,
  });
}

/**
 * Uploads a file buffer directly to Cloudinary
 */
export async function uploadBufferToCloudinary(
  buffer: Buffer,
  modelName: SupportedModelFolder,
  options?: UploadApiOptions
): Promise<UploadApiResponse> {
  const folder = `${CLOUDINARY_ROOT_FOLDER}/${modelName}`;
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
        ...options,
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Upload failed without result"));
        } else {
          resolve(result);
        }
      }
    );
    uploadStream.end(buffer);
  });
}

/**
 * Deletes a file from Cloudinary by its publicId
 */
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: "image" | "raw" | "video" = "image"
): Promise<unknown> {
  return await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
}

/**
 * Helper to build an optimized Cloudinary delivery URL
 */
export function getCloudinaryUrl(
  publicId: string,
  options?: { width?: number; height?: number; crop?: string; quality?: string | number }
): string {
  return cloudinary.url(publicId, {
    secure: true,
    fetch_format: "auto",
    quality: options?.quality ?? "auto",
    width: options?.width,
    height: options?.height,
    crop: options?.crop ?? "limit",
  });
}

export { cloudinary };
