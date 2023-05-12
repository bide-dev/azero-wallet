import { ApiPromise } from '@polkadot/api';
import { defaultSnapOrigin } from '../config';
import { GetSnapsResponse, Snap } from '../types';

import * as azeroSnap from 'azero-snap-adapter';


// TODO: Add to snap adapter
/**
 * Get the installed snaps in MetaMask.
 *
 * @returns The snaps installed in MetaMask.
 */
export const getSnaps = async (): Promise<GetSnapsResponse> => {
  return (await window.ethereum.request({
    method: 'wallet_getSnaps',
  })) as unknown as GetSnapsResponse;
};

/**
 * Connect a snap to MetaMask.
 *
 * @param snapId - The ID of the snap.
 * @param params - The params to pass with the snap to connect.
 */
export const connectSnap = async (
  snapId: string = defaultSnapOrigin,
  params: Record<'version' | string, unknown> = {},
) => {
  await azeroSnap.connect(snapId, params);
};

// TODO: Add to snap adapter
/**
 * Get the snap from MetaMask.
 *
 * @param version - The version of the snap to install (optional).
 * @returns The snap object returned by the extension.
 */
export const getSnap = async (version?: string): Promise<Snap | undefined> => {
  console.log('getSnap', version);
  try {
    const snaps = await getSnaps();

    return Object.values(snaps).find(
      (snap) =>
        snap.id === defaultSnapOrigin && (!version || snap.version === version),
    );
  } catch (e) {
    console.log('Failed to obtain installed snap', e);
    return undefined;
  }
};

/**
 * Invoke the "hello" method from the example snap.
 */

export const sendTxTransferToSelf = async () => {
  const accounts = await azeroSnap.getAccounts();
  if (accounts.length === 0) {
    return;
  }
  const account = accounts[0];
  console.log({ account });

  const api = await ApiPromise.create();
  const transfer = api.tx.balances.transfer(account, 12345);
  console.log({ transfer });

  await azeroSnap.sendTxTransferToSelf(account);

};

export const isLocalSnap = (snapId: string) => snapId.startsWith('local:');
