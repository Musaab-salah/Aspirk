#!/usr/bin/env node

/**
 * Script to automatically add suppressHydrationWarning to input elements
 * that are missing it, to prevent hydration warnings from browser extensions
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all TypeScript and JavaScript files in the app directory
const files = glob.sync('app/**/*.{ts,tsx,js,jsx}', { cwd: process.cwd() });
const componentFiles = glob.sync('components/**/*.{ts,tsx,js,jsx}', { cwd: process.cwd() });

const allFiles = [...files, ...componentFiles];

console.log('🔍 Checking for input elements missing suppressHydrationWarning...');

let fixedFiles = 0;
let totalInputs = 0;

allFiles.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Find input elements that don't have suppressHydrationWarning
    const inputRegex = /<input[^>]*type="text"[^>]*(?!.*suppressHydrationWarning)[^>]*>/g;
    const matches = content.match(inputRegex);
    
    if (matches && matches.length > 0) {
      console.log(`📝 Found ${matches.length} input(s) in ${filePath}`);
      totalInputs += matches.length;
      
      // Add suppressHydrationWarning to each input
      let newContent = content;
      matches.forEach(match => {
        // Check if suppressHydrationWarning is already present
        if (!match.includes('suppressHydrationWarning')) {
          // Add suppressHydrationWarning before the closing >
          const newMatch = match.replace(/>$/, ' suppressHydrationWarning>');
          newContent = newContent.replace(match, newMatch);
        }
      });
      
      // Write the updated content back to the file
      if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`✅ Fixed ${filePath}`);
        fixedFiles++;
      }
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
});

console.log(`\n📊 Summary:`);
console.log(`   Files processed: ${allFiles.length}`);
console.log(`   Files fixed: ${fixedFiles}`);
console.log(`   Total inputs found: ${totalInputs}`);

if (fixedFiles > 0) {
  console.log('\n🎉 Hydration warnings should now be resolved!');
  console.log('💡 Remember to restart your development server for changes to take effect.');
} else {
  console.log('\n✨ No files needed fixing - all inputs already have suppressHydrationWarning!');
}
