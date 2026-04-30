import { NextRequest, NextResponse } from 'next/server';
import { uploadToR2, generateR2Path } from '@/lib/r2';
import { rateLimit, getClientIp, rateLimitResponse, rateLimitConfigs } from '@/lib/rate-limit';

const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = getClientIp(request);
    const { success, reset } = await rateLimit(`upload:${clientIp}`, rateLimitConfigs.upload);
    if (!success) return rateLimitResponse(reset);

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!VALID_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and AVIF images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.` },
        { status: 400 }
      );
    }

    // Validate file signature (magic bytes) for additional security
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const isValidImage = validateImageSignature(bytes, file.type);
    
    if (!isValidImage) {
      return NextResponse.json(
        { error: 'Invalid image file. File signature does not match declared type.' },
        { status: 400 }
      );
    }

    // Check R2 credentials
    if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
      console.error('R2 credentials missing');
      return NextResponse.json({ error: 'Storage not configured' }, { status: 500 });
    }

    const path = generateR2Path(file.name, 'products');
    const url = await uploadToR2(file, path, file.type);

    return NextResponse.json({ url, path });
  } catch (error) {
    console.error('Upload error:', error);
    const message = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Validate image file signature (magic bytes)
function validateImageSignature(bytes: Uint8Array, mimeType: string): boolean {
  // JPEG: FF D8 FF
  if (mimeType === 'image/jpeg') {
    return bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF;
  }
  
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (mimeType === 'image/png') {
    return (
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4E &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0D &&
      bytes[5] === 0x0A &&
      bytes[6] === 0x1A &&
      bytes[7] === 0x0A
    );
  }
  
  // WebP: RIFF ... WEBP
  if (mimeType === 'image/webp') {
    return (
      bytes[0] === 0x52 && // R
      bytes[1] === 0x49 && // I
      bytes[2] === 0x46 && // F
      bytes[3] === 0x46 && // F
      bytes[8] === 0x57 && // W
      bytes[9] === 0x45 && // E
      bytes[10] === 0x42 && // B
      bytes[11] === 0x50 // P
    );
  }
  
  // AVIF: more complex, basic check
  if (mimeType === 'image/avif') {
    // Check for ftyp box
    return bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70;
  }
  
  return false;
}
