/**
 * Cloudflare R2 Storage Utility
 * S3-compatible object storage with free bandwidth
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

// Initialize R2 client (S3-compatible)
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'sultania-gadgets-images';
const PUBLIC_URL = process.env.R2_PUBLIC_URL || 'https://pub-xxxxx.r2.dev';

/**
 * Upload file to R2
 * @param file - File or Buffer to upload
 * @param path - Path in bucket (e.g., 'products/image.jpg')
 * @param contentType - MIME type (default: 'image/jpeg')
 * @returns Public URL of uploaded file
 */
export async function uploadToR2(
  file: File | Buffer,
  path: string,
  contentType: string = 'image/jpeg'
): Promise<string> {
  try {
    // Convert File to Buffer if needed
    const buffer = file instanceof File 
      ? Buffer.from(await file.arrayBuffer()) 
      : file;
    
    // Upload to R2
    await r2Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: path,
        Body: buffer,
        ContentType: contentType,
        CacheControl: 'public, max-age=31536000', // Cache for 1 year
      })
    );
    
    // Return public URL
    return `${PUBLIC_URL}/${path}`;
  } catch (error) {
    console.error('R2 upload failed:', error);
    throw new Error('Failed to upload image to R2');
  }
}

/**
 * Delete file from R2
 * @param path - Path in bucket (e.g., 'products/image.jpg')
 */
export async function deleteFromR2(path: string): Promise<void> {
  try {
    await r2Client.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: path,
      })
    );
  } catch (error) {
    console.error('R2 delete failed:', error);
    throw new Error('Failed to delete image from R2');
  }
}

/**
 * Get public URL for R2 file
 * @param path - Path in bucket (e.g., 'products/image.jpg')
 * @returns Public URL
 */
export function getR2Url(path: string): string {
  return `${PUBLIC_URL}/${path}`;
}

/**
 * List files in R2 bucket
 * @param prefix - Optional prefix to filter (e.g., 'products/')
 * @returns Array of file keys
 */
export async function listR2Files(prefix?: string): Promise<string[]> {
  try {
    const response = await r2Client.send(
      new ListObjectsV2Command({
        Bucket: BUCKET_NAME,
        Prefix: prefix,
      })
    );
    
    return response.Contents?.map((item: any) => item.Key!) || [];
  } catch (error) {
    console.error('R2 list failed:', error);
    return [];
  }
}

/**
 * Generate unique filename for upload
 * @param originalName - Original filename
 * @param folder - Folder in bucket (default: 'products')
 * @returns Unique path
 */
export function generateR2Path(originalName: string, folder: string = 'products'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  const extension = originalName.split('.').pop() || 'jpg';
  const sanitized = originalName
    .replace(/[^a-zA-Z0-9.-]/g, '-')
    .toLowerCase();
  
  return `${folder}/${timestamp}-${random}-${sanitized}`;
}

/**
 * Extract path from R2 URL
 * @param url - Full R2 URL
 * @returns Path in bucket
 */
export function extractR2Path(url: string): string {
  return url.replace(PUBLIC_URL + '/', '');
}

/**
 * Check if URL is from R2
 * @param url - URL to check
 * @returns True if R2 URL
 */
export function isR2Url(url: string): boolean {
  return url.startsWith(PUBLIC_URL);
}
