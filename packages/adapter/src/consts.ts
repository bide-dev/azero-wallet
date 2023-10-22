// This string is replaced on build time with the actual snap id.
// See scripts/post-build.ts for details
// eslint-disable-next-line import/prefer-default-export
let SNAP_ID = '__SNAP_ID__';

export const setSnapId = (snapId: string): void => {
  SNAP_ID = snapId;
};

export const getSnapId = (): string => SNAP_ID;
