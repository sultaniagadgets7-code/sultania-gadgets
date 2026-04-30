/**
 * Test R2 Upload
 * Run: npx tsx scripts/test-r2.ts
 */

import { uploadToR2, getR2Url, listR2Files } from '../src/lib/r2';
import fs from 'fs';
import path from 'path';

async function testR2() {
  console.log('🧪 Testing Cloudflare R2 Setup...\n');
  
  // Check environment variables
  console.log('1️⃣ Checking environment variables...');
  const requiredVars = [
    'R2_ACCOUNT_ID',
    'R2_ACCESS_KEY_ID',
    'R2_SECRET_ACCESS_KEY',
    'R2_BUCKET_NAME',
    'R2_PUBLIC_URL',
  ];
  
  const missing = requiredVars.filter(v => !process.env[v]);
  
  if (missing.length > 0) {
    console.error('❌ Missing environment variables:');
    missing.forEach(v => console.error(`   - ${v}`));
    console.error('\n📝 Add these to .env.local:');
    console.error('   R2_ACCOUNT_ID=your_account_id');
    console.error('   R2_ACCESS_KEY_ID=your_access_key');
    console.error('   R2_SECRET_ACCESS_KEY=your_secret_key');
    console.error('   R2_BUCKET_NAME=sultania-gadgets-images');
    console.error('   R2_PUBLIC_URL=https://pub-xxxxx.r2.dev');
    process.exit(1);
  }
  
  console.log('✅ All environment variables present\n');
  
  // Test upload
  console.log('2️⃣ Testing file upload...');
  
  try {
    // Find a test image
    const testImagePath = path.join(process.cwd(), 'public', 'logo.svg');
    
    if (!fs.existsSync(testImagePath)) {
      console.error('❌ Test image not found:', testImagePath);
      console.error('   Using fallback test data...');
      
      // Create a simple test file
      const testData = Buffer.from('Test image data');
      const url = await uploadToR2(
        testData,
        'test/test-image.txt',
        'text/plain'
      );
      
      console.log('✅ Upload successful!');
      console.log('   URL:', url);
    } else {
      const testImage = fs.readFileSync(testImagePath);
      const url = await uploadToR2(
        testImage,
        'test/logo.svg',
        'image/svg+xml'
      );
      
      console.log('✅ Upload successful!');
      console.log('   URL:', url);
      console.log('\n📸 Visit this URL to see your image:');
      console.log('   ' + url);
    }
  } catch (error: any) {
    console.error('❌ Upload failed:', error.message);
    console.error('\n🔍 Troubleshooting:');
    console.error('   1. Check your R2 credentials are correct');
    console.error('   2. Verify bucket name matches exactly');
    console.error('   3. Ensure public access is enabled on bucket');
    console.error('   4. Check account ID is correct');
    process.exit(1);
  }
  
  console.log('\n3️⃣ Testing file listing...');
  
  try {
    const files = await listR2Files('test/');
    console.log(`✅ Found ${files.length} file(s) in test/ folder`);
    if (files.length > 0) {
      console.log('   Files:');
      files.forEach(f => console.log(`   - ${f}`));
    }
  } catch (error: any) {
    console.error('⚠️  Listing failed:', error.message);
  }
  
  console.log('\n✅ R2 Setup Complete!');
  console.log('\n📋 Next Steps:');
  console.log('   1. Add R2 credentials to Vercel:');
  console.log('      vercel env add R2_ACCOUNT_ID');
  console.log('      vercel env add R2_ACCESS_KEY_ID');
  console.log('      vercel env add R2_SECRET_ACCESS_KEY');
  console.log('      vercel env add R2_BUCKET_NAME');
  console.log('      vercel env add R2_PUBLIC_URL');
  console.log('   2. Deploy to production:');
  console.log('      vercel --prod');
  console.log('   3. New product images will use R2 automatically');
}

testR2().catch(console.error);
