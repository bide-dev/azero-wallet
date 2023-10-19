import { promises as fs } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const bundlePath = join(__dirname, '../dist/snap.js');

const missingVariables = ['window.addEventListener = function(){};', 'let yp;', 'let location;'];

async function fixBundle() {
  console.log(`Fixing ${bundlePath}`);
  const contents = await fs.readFile(bundlePath, 'utf8');
  const missingVariableStubs = missingVariables.reduce((acc, curr) => {
    return `${acc}\n\n${curr}`;
  });
  const missingVariableBlock = `\n\n${missingVariableStubs}`;

  // Looking for a first break-line after the first line of the file
  // This is where we can safely inject our code
  const fixed = contents.replace('\n\n', missingVariableBlock);
  await fs.writeFile(bundlePath, fixed);
}

fixBundle().catch((err) => console.error(err));
