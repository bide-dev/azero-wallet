/**
 * The snap origin to use.
 * Will default to the local hosted snap if no value is provided in environment.
 */
// eslint-disable-next-line no-restricted-globals
export const defaultSnapOrigin = process.env.SNAP_ORIGIN ?? 'npm:azero-wallet';
