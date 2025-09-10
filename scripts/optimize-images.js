#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function optimizeImage(inputPath, outputPath, maxWidth = 512) {
  try {
    const stats = await fs.stat(inputPath);
    const sizeBefore = (stats.size / 1024).toFixed(2);
    
    // Convert to WebP with quality optimization
    await sharp(inputPath)
      .resize(maxWidth, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ quality: 85, effort: 6 })
      .toFile(outputPath);
    
    const statsAfter = await fs.stat(outputPath);
    const sizeAfter = (statsAfter.size / 1024).toFixed(2);
    const savings = ((1 - statsAfter.size / stats.size) * 100).toFixed(1);
    
    console.log(`✅ ${path.basename(inputPath)}: ${sizeBefore}KB → ${sizeAfter}KB (${savings}% saved)`);
    return { before: stats.size, after: statsAfter.size };
  } catch (error) {
    console.error(`❌ Error optimizing ${inputPath}:`, error.message);
    return { before: 0, after: 0 };
  }
}

async function optimizeTeamLogos() {
  const logosDir = path.join(__dirname, '..', 'public', 'logos', 'teams');
  const optimizedDir = path.join(__dirname, '..', 'public', 'logos', 'teams', 'optimized');
  
  // Create optimized directory if it doesn't exist
  await fs.mkdir(optimizedDir, { recursive: true });
  
  // Get all PNG files
  const files = await fs.readdir(logosDir);
  const pngFiles = files.filter(file => file.endsWith('.png'));
  
  console.log(`\n🖼️  Optimizing ${pngFiles.length} team logos...\n`);
  
  let totalBefore = 0;
  let totalAfter = 0;
  
  // Optimize each image
  for (const file of pngFiles) {
    const inputPath = path.join(logosDir, file);
    const outputName = file.replace('.png', '.webp');
    const outputPath = path.join(optimizedDir, outputName);
    
    const result = await optimizeImage(inputPath, outputPath, 512);
    totalBefore += result.before;
    totalAfter += result.after;
  }
  
  // Optimize sponsor logos
  const sponsorsDir = path.join(__dirname, '..', 'public', 'logos', 'sponsors');
  const sponsorsOptimizedDir = path.join(__dirname, '..', 'public', 'logos', 'sponsors', 'optimized');
  
  await fs.mkdir(sponsorsOptimizedDir, { recursive: true });
  
  const sponsorFiles = await fs.readdir(sponsorsDir);
  const sponsorPngFiles = sponsorFiles.filter(file => file.endsWith('.png'));
  
  console.log(`\n🏢 Optimizing ${sponsorPngFiles.length} sponsor logos...\n`);
  
  for (const file of sponsorPngFiles) {
    const inputPath = path.join(sponsorsDir, file);
    const outputName = file.replace('.png', '.webp');
    const outputPath = path.join(sponsorsOptimizedDir, outputName);
    
    const result = await optimizeImage(inputPath, outputPath, 400);
    totalBefore += result.before;
    totalAfter += result.after;
  }
  
  // Optimize main logos
  const mainLogos = ['viktorialogo.png', 'SVVW.png'];
  
  console.log(`\n⚽ Optimizing main logos...\n`);
  
  for (const logo of mainLogos) {
    const inputPath = path.join(__dirname, '..', 'public', logo);
    const outputPath = path.join(__dirname, '..', 'public', logo.replace('.png', '.webp'));
    
    const result = await optimizeImage(inputPath, outputPath, 256);
    totalBefore += result.before;
    totalAfter += result.after;
  }
  
  // Summary
  const totalSavings = ((1 - totalAfter / totalBefore) * 100).toFixed(1);
  console.log(`\n✨ Optimization Complete!`);
  console.log(`📊 Total: ${(totalBefore / 1024 / 1024).toFixed(2)}MB → ${(totalAfter / 1024 / 1024).toFixed(2)}MB`);
  console.log(`💾 Saved: ${((totalBefore - totalAfter) / 1024 / 1024).toFixed(2)}MB (${totalSavings}%)\n`);
}

// Run optimization
optimizeTeamLogos().catch(console.error);