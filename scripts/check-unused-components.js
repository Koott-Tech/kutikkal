#!/usr/bin/env node

/**
 * Check which components are not used anywhere in the codebase
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, '..', 'src', 'components');
const SRC_DIR = path.join(__dirname, '..', 'src');

// Get all component files
const componentFiles = fs.readdirSync(COMPONENTS_DIR)
  .filter(file => file.endsWith('.jsx') || file.endsWith('.js'))
  .filter(file => !file.includes('.test.') && !file.includes('.spec.'));

// Get component names (without extension)
const componentNames = componentFiles.map(file => {
  const name = file.replace(/\.(jsx|js)$/, '');
  return { file, name, fullPath: path.join(COMPONENTS_DIR, file) };
});

// Recursively find all JS/JSX files in src
function findJSFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules, .next, coverage, components (we're checking from components)
      if (!['node_modules', '.next', 'coverage', '__tests__', 'components'].includes(file)) {
        findJSFiles(filePath, fileList);
      }
    } else if ((file.endsWith('.js') || file.endsWith('.jsx')) && !file.includes('.test.') && !file.includes('.spec.')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Find all source files
const allSourceFiles = findJSFiles(SRC_DIR);

// Check each component
const unusedComponents = [];
const usedComponents = [];

componentNames.forEach(({ file, name, fullPath }) => {
  // Read component file to get export name
  const content = fs.readFileSync(fullPath, 'utf8');
  
  // Check for default export
  const hasDefaultExport = /export\s+default\s+function\s+(\w+)|export\s+default\s+(\w+)|^export\s+default/m.test(content);
  
  // Get the actual export name
  let exportName = name;
  const defaultMatch = content.match(/export\s+default\s+function\s+(\w+)/);
  if (defaultMatch) {
    exportName = defaultMatch[1];
  }
  
  // Search patterns - check for various import styles
  const patterns = [
    new RegExp(`import.*${name}.*from`, 'i'),
    new RegExp(`import.*${exportName}.*from`, 'i'),
    new RegExp(`from.*['"]\\.\\.?/.*${name}['"]`, 'i'),
    new RegExp(`from.*['"]@/components/${name}['"]`, 'i'),
    new RegExp(`from.*['"]@/components/${name}\\.jsx['"]`, 'i'),
    new RegExp(`from.*['"]\\.\\.?/components/${name}['"]`, 'i'),
    new RegExp(`from.*['"]\\.\\.?/components/${name}\\.jsx['"]`, 'i'),
    new RegExp(`from.*['"]@/components/${name}\\.js['"]`, 'i'),
    new RegExp(`<${exportName}[\\s/>]`, 'i'),
    new RegExp(`<${name}[\\s/>]`, 'i'),
    // Also check for require statements
    new RegExp(`require.*['"]\\.\\.?/.*${name}['"]`, 'i'),
    new RegExp(`require.*['"]@/components/${name}['"]`, 'i'),
  ];
  
  let isUsed = false;
  
  // Check in all source files (except the component itself)
  for (const sourceFile of allSourceFiles) {
    if (sourceFile === fullPath) continue; // Skip self
    
    const sourceContent = fs.readFileSync(sourceFile, 'utf8');
    
    // Check all patterns
    for (const pattern of patterns) {
      if (pattern.test(sourceContent)) {
        isUsed = true;
        break;
      }
    }
    
    if (isUsed) break;
  }
  
  if (isUsed) {
    usedComponents.push({ file, name, exportName });
  } else {
    unusedComponents.push({ file, name, exportName });
  }
});

// Output results
console.log('🔍 Component Usage Analysis\n');
console.log(`Total components: ${componentNames.length}`);
console.log(`Used components: ${usedComponents.length}`);
console.log(`Unused components: ${unusedComponents.length}\n`);

if (unusedComponents.length > 0) {
  console.log('❌ UNUSED COMPONENTS:\n');
  unusedComponents.forEach(({ file, name, exportName }) => {
    console.log(`   ${file}`);
    console.log(`   └─ Component: ${exportName || name}`);
    console.log('');
  });
} else {
  console.log('✅ All components are being used!');
}

console.log('\n📊 Used Components Summary:');
usedComponents.forEach(({ file }) => {
  console.log(`   ✅ ${file}`);
});

process.exit(0);
