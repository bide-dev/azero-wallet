/**
 * The snap origin to use.
 * Will default to the local hosted snap if no value is provided in environment.
 */
export const defaultSnapOrigin =
  // eslint-disable-next-line no-restricted-globals
  process.env.REACT_APP_SNAP_ORIGIN ?? 'npm:azero-wallet';
