// eslint-disable-next-line import/no-extraneous-dependencies
import replace from 'replace-in-file';

// eslint-disable-next-line node/no-process-env
const DEV = process.env.NODE_ENV === 'development';

const SNAP_ID = DEV ? 'local:http://localhost:8080' : 'npm:azero-wallet';

// eslint-disable-next-line node/no-sync
replace.replaceInFileSync({
  files: [
    'dist/cjs/consts.d.ts',
    'dist/cjs/consts.js',
    'dist/es/consts.d.ts',
    'dist/es/consts.js',
  ],
  from: '__SNAP_ID__',
  to: SNAP_ID,
});

// eslint-disable-next-line no-console
console.log(`\nReplaced __SNAP_ID__ with ${SNAP_ID}\n`);

export {};
