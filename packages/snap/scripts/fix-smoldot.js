const fs = require('fs').promises;
const path = require('path');

const dirPath =
  '../../../node_modules/@substrate/smoldot-light/dist/cjs/instance/autogen';

// SES doesn't like double slashes in strings, so we need to replace them with single slashes
// and string concatenation.
/**
 *
 */
async function fixDoubleSlash() {
  const files = ['wasm0.js', 'wasm1.js', 'wasm2.js'];
  for (const file of files) {
    console.log(`Fixing ${file}`);
    const filePath = path.join(__dirname, dirPath, file);
    let fixedContents = await fs.readFile(filePath, 'utf8');
    while (fixedContents.includes('//')) {
      fixedContents = fixedContents.split('//').join('/"+"/');
    }
    await fs.writeFile(filePath, fixedContents);
  }
}

fixDoubleSlash();
