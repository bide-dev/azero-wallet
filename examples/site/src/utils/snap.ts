import {
  connect,
  getAccount,
  signAndSendExtrinsicTransactionPayload,
  transferNativeAsset,
} from 'azero-wallet-adapter';
import {
  TransferNativeAssetRequestParams,
  SignAndSendTransactionRequestParams,
} from 'azero-wallet-types';

import { generateTransactionPayload, getApi } from './polkadot';
import { defaultSnapOrigin } from '../config/snap';
import { GetSnapsResponse, Snap } from '../types';

export const getSnaps = async (): Promise<
  Partial<GetSnapsResponse> | null | undefined
> => {
  // eslint-disable-next-line no-restricted-globals
  return await window.ethereum.request({
    method: 'wallet_getSnaps',
  });
};

export const connectSnap = async () => await connect();

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
    if (!snaps) {
      return undefined;
    }
    console.log({ snaps });
    console.log({ defaultSnapOrigin });

    return Object.values(snaps).find(
      (snap) => snap && snap.id === defaultSnapOrigin, // &&
      // (!version || snap.version === version),
    );
  } catch (error: unknown) {
    console.log('Failed to obtain installed snap', error);
    return undefined;
  }
};

export const sendTransferToSelfUsingLocalPayload = async () => {
  const myAccount = await getAccount();
  const api = await getApi();
  const payload = await generateTransactionPayload(
    api,
    myAccount.address,
    myAccount.address,
    '1',
  );
  const params: SignAndSendTransactionRequestParams = {
    payload,
  };
  return await signAndSendExtrinsicTransactionPayload(params);
};

export const sendTransferToSelfUsingSnapPayload = async () => {
  const myAccount = await getAccount();
  const params: TransferNativeAssetRequestParams = {
    recipient: myAccount.address,
    amount: '1',
  };
  return await transferNativeAsset(params);
};

export const isLocalSnap = (snapId: string) => snapId.startsWith('local:');
