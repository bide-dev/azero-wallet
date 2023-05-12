const fs = require('fs').promises;
const path = require('path');

const bundlePath = path.join(__dirname, '../dist/index.js');

const missingTypes = ['window.addEventListener = function(){};'];

/**
 *
 */
async function fixBundle() {
  console.log(`Fixing ${bundlePath}`);
  const contents = await fs.readFile(bundlePath, 'utf8');
  const missingTypesStubs = missingTypes.reduce((acc, curr) => {
    return `${acc}\n\n${curr}`;
  });
  const prefixedMissingTypeStubs = `\n\n${missingTypesStubs}`;

  // Looking for a first break-line after the first line of the file
  // This is where we can safely inject our code
  const fixed = contents.replace('\n\n', prefixedMissingTypeStubs);
  await fs.writeFile(bundlePath, fixed);
}

fixBundle().catch((err) => console.error(err));
