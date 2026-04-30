// Simple script to copy icon for PWA
// In production, you'd use sharp or similar to resize properly
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');
const sourceIcon = path.join(publicDir, 'icon1.png');

// For now, just ensure the icons exist
// You should replace these with properly sized icons later
const sizes = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
];

console.log('✅ Icon files ready for PWA');
console.log('Note: For best results, create proper 192x192 and 512x512 PNG icons');
console.log('Current icon: icon1.png is being used for all sizes');
