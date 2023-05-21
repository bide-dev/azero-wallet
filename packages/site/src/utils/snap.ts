import * as azeroSnap from 'azero-snap-adapter';

import { generateTransactionPayload, getApi } from './polkadot';
import { defaultSnapOrigin } from '../config';
import { GetSnapsResponse, Snap } from '../types';

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
  // await azeroSnap.connect(snapId, params);
  await azeroSnap.connect();
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
    console.log({ snaps });
    console.log({ defaultSnapOrigin });

    return Object.values(snaps).find(
      (snap) =>
        snap.id === defaultSnapOrigin && (!version || snap.version === version),
    );
  } catch (e) {
    console.log('Failed to obtain installed snap', e);
    return undefined;
  }
};

export const sendTxTransferToSelf = async () => {
  const accounts = await azeroSnap.getAccounts();
  if (accounts.length === 0) {
    return;
  }
  const recipient = accounts[0];
  console.log({ recipient });

  const api = await getApi();
  const txPayload = await generateTransactionPayload(
    api,
    recipient,
    recipient,
    '1',
  );

  const txInfo = await azeroSnap.signAndSendTransactionPayload(txPayload);
  console.log({ txInfo });
};

export const isLocalSnap = (snapId: string) => snapId.startsWith('local:');
