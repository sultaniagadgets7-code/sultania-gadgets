import sharp from 'sharp';
import { readFileSync } from 'fs';

const svgContent = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#ffffff"/>
  <path d="M310 60 L160 270 L230 270 L120 450 L370 220 L290 220 L380 60 Z" fill="#cc0000"/>
</svg>`;

const svgBuf = Buffer.from(svgContent);

await sharp(svgBuf).resize(512, 512).png().toFile('src/app/icon.png');
console.log('src/app/icon.png created');

await sharp(svgBuf).resize(180, 180).png().toFile('src/app/apple-icon.png');
console.log('src/app/apple-icon.png created');

await sharp(svgBuf).resize(512, 512).png().toFile('public/icon1.png');
console.log('public/icon1.png updated');

await sharp(svgBuf).resize(180, 180).png().toFile('public/apple-icon.png');
console.log('public/apple-icon.png updated');

console.log('All favicon files generated!');
