import { promises as fs } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const bundlePath = join(__dirname, '../dist/snap.js');

// const missingVariables = ['window.addEventListener = function(){};'];

async function fixBundle() {
  console.log(`Fixing snap bundle at: ${bundlePath}`);
  const contents = await fs.readFile(bundlePath, 'utf8');

  // We also need update this section in the snap bundle
  const section = `const packageInfo = {
    name: '@polkadot/api',
    path: {
      url: typeof document === 'undefined' && typeof location === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : typeof document === 'undefined' ? location.href : _documentCurrentScript && _documentCurrentScript.src || new URL('snap.js', document.baseURI).href
    } && (typeof document === 'undefined' && typeof location === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : typeof document === 'undefined' ? location.href : _documentCurrentScript && _documentCurrentScript.src || new URL('snap.js', document.baseURI).href) ? new URL(typeof document === 'undefined' && typeof location === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : typeof document === 'undefined' ? location.href : _documentCurrentScript && _documentCurrentScript.src || new URL('snap.js', document.baseURI).href).pathname.substring(0, new URL(typeof document === 'undefined' && typeof location === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : typeof document === 'undefined' ? location.href : _documentCurrentScript && _documentCurrentScript.src || new URL('snap.js', document.baseURI).href).pathname.lastIndexOf('/') + 1) : 'auto',
    type: 'esm',
    version: '9.14.2'
  };`;
  const updatedSection = `const packageInfo = {
    name: '@polkadot/api',
    path: undefined,
    type: 'esm',
    version: '9.14.2'
  };`;
  const fixed = contents.replace(section, updatedSection);

  await fs.writeFile(bundlePath, fixed);
}

fixBundle().catch((err) => console.error(err));
