#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const QUALITY = {
  webp: 85,
  avif: 80
};

const SIZES = {
  // For logos and icons
  logo: [48, 64, 96, 128, 256],
  // For sponsor logos  
  sponsor: [100, 150, 200, 300, 400],
  // For team logos
  team: [48, 64, 96, 128, 192]
};

async function processImage(inputPath, outputDir, baseName, sizes, formats = ['webp']) {
  const stats = await fs.stat(inputPath);
  
  for (const format of formats) {
    for (const size of sizes) {
      const outputName = `${baseName}-${size}w.${format}`;
      const outputPath = path.join(outputDir, outputName);
      
      try {
        await sharp(inputPath)
          .resize(size, null, {
            withoutEnlargement: true,
            fit: 'inside'
          })
          [format]({ quality: QUALITY[format] })
          .toFile(outputPath);
          
        const newStats = await fs.stat(outputPath);
        const saved = Math.round((stats.size - newStats.size) / 1024);
        console.log(`✓ ${outputName} (saved ${saved}KB)`);
      } catch (error) {
        console.error(`✗ Failed to process ${outputName}:`, error.message);
      }
    }
    
    // Also create a full-size optimized version
    const fullSizeName = `${baseName}.${format}`;
    const fullSizePath = path.join(outputDir, fullSizeName);
    
    try {
      await sharp(inputPath)
        [format]({ quality: QUALITY[format] })
        .toFile(fullSizePath);
        
      const newStats = await fs.stat(fullSizePath);
      const saved = Math.round((stats.size - newStats.size) / 1024);
      console.log(`✓ ${fullSizeName} (saved ${saved}KB)`);
    } catch (error) {
      console.error(`✗ Failed to process ${fullSizeName}:`, error.message);
    }
  }
}

async function optimizeImages() {
  console.log('🖼️  Starting image optimization...\n');
  
  // Create optimized directories
  const dirs = [
    'public/optimized',
    'public/optimized/logos',
    'public/optimized/logos/sponsors',
    'public/optimized/logos/teams'
  ];
  
  for (const dir of dirs) {
    await fs.mkdir(dir, { recursive: true });
  }
  
  // Process main logos
  console.log('📁 Processing main logos...');
  await processImage('public/viktorialogo.png', 'public/optimized', 'viktorialogo', SIZES.logo, ['webp', 'avif']);
  await processImage('public/SVVW.png', 'public/optimized', 'SVVW', SIZES.logo, ['webp', 'avif']);
  
  // Process sponsor logos
  console.log('\n📁 Processing sponsor logos...');
  const sponsorLogos = await fs.readdir('public/logos/sponsors');
  for (const logo of sponsorLogos) {
    if (logo.endsWith('.png')) {
      const baseName = path.basename(logo, '.png');
      await processImage(
        path.join('public/logos/sponsors', logo),
        'public/optimized/logos/sponsors',
        baseName,
        SIZES.sponsor,
        ['webp']
      );
    }
  }
  
  // Process team logos
  console.log('\n📁 Processing team logos...');
  const teamLogos = await fs.readdir('public/logos/teams');
  for (const logo of teamLogos) {
    if (logo.endsWith('.png')) {
      const baseName = path.basename(logo, '.png');
      await processImage(
        path.join('public/logos/teams', logo),
        'public/optimized/logos/teams',
        baseName,
        SIZES.team,
        ['webp']
      );
    }
  }
  
  console.log('\n✅ Image optimization complete!');
}

optimizeImages().catch(console.error);