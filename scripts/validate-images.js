#!/usr/bin/env node

/**
 * Image Validation Script
 * 
 * Scans all JS/JSX files for image references and validates that
 * static images in /public folder exist.
 * 
 * Usage: node scripts/validate-images.js
 */

const fs = require('fs');
const path = require('path');

// Image extensions to check
const IMAGE_EXTENSIONS = ['.webp', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico'];
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const SRC_DIR = path.join(__dirname, '..', 'src');

// Patterns to find image references in code
const IMAGE_PATTERNS = [
  // src="/image.webp"
  /src=["']([^"']+\.(webp|png|jpg|jpeg|gif|svg|ico))["']/gi,
  // image: "/image.webp"
  /image:\s*["']([^"']+\.(webp|png|jpg|jpeg|gif|svg|ico))["']/gi,
  // backgroundImage: "url('/image.webp')"
  /backgroundImage:\s*["']url\(["']?([^"')]+\.(webp|png|jpg|jpeg|gif|svg|ico))["']?\)["']/gi,
  // url('/image.webp')
  /url\(["']?([^"')]+\.(webp|png|jpg|jpeg|gif|svg|ico))["']?\)/gi,
  // Image src={"/image.webp"}
  /src=\{["']([^"']+\.(webp|png|jpg|jpeg|gif|svg|ico))["']\}/gi,
];

// Patterns to exclude (dynamic images, external URLs, etc.)
const EXCLUDE_PATTERNS = [
  /^https?:\/\//,           // External URLs
  /^\/api\/images\//,        // API proxy images (dynamic)
  /^\/storage\/v1\//,        // Supabase storage (dynamic)
  /supabase\.co/,            // Supabase URLs
  /^data:/,                  // Data URIs
  /^\${/,                    // Template literals
  /process\.env/,            // Environment variables
  /\.\.\//,                  // Relative paths (../)
  /^\.\//,                   // Relative paths (./)
];

/**
 * Extract image paths from a file
 */
function extractImagePaths(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const images = new Set();
  
  IMAGE_PATTERNS.forEach(pattern => {
    const matches = content.matchAll(pattern);
    for (const match of matches) {
      // Get the first capture group (the image path)
      const imagePath = match[1] || match[0];
      if (imagePath) {
        images.add(imagePath);
      }
    }
  });
  
  return Array.from(images);
}

/**
 * Check if an image path should be validated
 */
function shouldValidate(imagePath) {
  // Skip excluded patterns
  for (const pattern of EXCLUDE_PATTERNS) {
    if (pattern.test(imagePath)) {
      return false;
    }
  }
  
  // Only validate paths starting with / (public folder)
  return imagePath.startsWith('/');
}

/**
 * Check if image exists in public folder
 * Also checks for alternative extensions (.webp, .png, .jpg, etc.)
 */
function imageExists(imagePath) {
  // Remove leading slash
  const relativePath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  const fullPath = path.join(PUBLIC_DIR, relativePath);
  
  // Check exact path first
  if (fs.existsSync(fullPath)) {
    return { exists: true, path: imagePath };
  }
  
  // Check for alternative extensions
  const baseName = path.basename(relativePath, path.extname(relativePath));
  const dir = path.dirname(relativePath);
  const dirPath = dir === '.' ? PUBLIC_DIR : path.join(PUBLIC_DIR, dir);
  
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath);
    const matchingFile = files.find(file => {
      const fileBaseName = path.basename(file, path.extname(file));
      return fileBaseName.toLowerCase() === baseName.toLowerCase();
    });
    
    if (matchingFile) {
      const suggestedPath = dir === '.' ? `/${matchingFile}` : `/${dir}/${matchingFile}`;
      return { exists: false, suggested: suggestedPath };
    }
  }
  
  return { exists: false };
}

/**
 * Recursively find all JS/JSX files in a directory
 */
function findJSFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules, .next, coverage directories
      if (!['node_modules', '.next', 'coverage'].includes(file)) {
        findJSFiles(filePath, fileList);
      }
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

/**
 * Main validation function
 */
function validateImages() {
  console.log('🔍 Scanning for image references...\n');
  
  // Find all JS/JSX files in src directory
  const files = findJSFiles(SRC_DIR);
  
  console.log(`📁 Found ${files.length} files to scan\n`);
  
  const missingImages = [];
  const validatedImages = new Set();
  let totalImagesFound = 0;
  
  // Scan each file
  for (const file of files) {
    const imagePaths = extractImagePaths(file);
    
    if (imagePaths.length > 0) {
      for (const imagePath of imagePaths) {
        totalImagesFound++;
        
        if (shouldValidate(imagePath)) {
          // Check if we've already validated this image
          if (!validatedImages.has(imagePath)) {
            validatedImages.add(imagePath);
            
            const checkResult = imageExists(imagePath);
            if (!checkResult.exists) {
              missingImages.push({
                path: imagePath,
                file: path.relative(SRC_DIR, file),
                suggested: checkResult.suggested,
              });
            }
          }
        }
      }
    }
  }
  
  // Report results
  console.log(`📊 Validation Results:\n`);
  console.log(`   Total image references found: ${totalImagesFound}`);
  console.log(`   Static images validated: ${validatedImages.size}`);
  console.log(`   Missing images: ${missingImages.length}\n`);
  
  if (missingImages.length > 0) {
    console.log('❌ Missing Images:\n');
    missingImages.forEach(({ path: imagePath, file, suggested }) => {
      console.log(`   ${imagePath}`);
      console.log(`   └─ Referenced in: ${file}`);
      if (suggested) {
        console.log(`   💡 Suggestion: Did you mean ${suggested}?`);
      }
      console.log('');
    });
    
    console.log('\n💡 Tip: Make sure all image files exist in the /public folder');
    console.log('   Example: /image.webp should be at public/image.webp\n');
    
    process.exit(1);
  } else {
    console.log('✅ All static images are valid!\n');
    process.exit(0);
  }
}

// Run validation
try {
  validateImages();
} catch (error) {
  console.error('❌ Error during validation:', error);
  process.exit(1);
}
