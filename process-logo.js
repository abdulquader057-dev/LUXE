const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function processLogo() {
  const inputPath = path.join(__dirname, 'public', 'brand', 'luxe-logo-gold.png');
  const fullWebpPath = path.join(__dirname, 'public', 'brand', 'luxe-logo-full.webp');
  const croppedWebpPath = path.join(__dirname, 'public', 'brand', 'luxe-logo-cropped.webp');

  if (!fs.existsSync(inputPath)) {
    console.error('Input logo not found:', inputPath);
    return;
  }

  const metadata = await sharp(inputPath).metadata();
  console.log(`Original dimensions: ${metadata.width}x${metadata.height}`);

  // Create full webp
  await sharp(inputPath)
    .webp({ quality: 90 })
    .toFile(fullWebpPath);
  console.log('Created full webp.');

  // Extract middle slice for navbar
  const w = metadata.width;
  const h = metadata.height;
  
  // Crop a 40% height horizontal slice from the middle.
  const cropHeight = Math.floor(h * 0.4);
  const cropTop = Math.floor((h - cropHeight) / 2);
  const cropWidth = Math.floor(w * 0.8);
  const cropLeft = Math.floor((w - cropWidth) / 2);
  
  await sharp(inputPath)
    .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
    .webp({ quality: 90 })
    .toFile(croppedWebpPath);
  console.log(`Created cropped webp: ${cropWidth}x${cropHeight} at (${cropLeft}, ${cropTop}).`);
}

processLogo().catch(console.error);
