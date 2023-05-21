import { ethErrors } from 'eth-rpc-errors';

import {
  getDefaultKeyringPair,
  recoverAccount,
  signAndSendExtrinsicTransaction,
  signSignerPayloadJSON,
} from './account';
import { PolkadotAPI } from './polkadot-api';
import { SnapState } from './state';

type HandlerParams = unknown[] | Record<string, unknown>;

export const importAccountFromSeedHandler = async (
  state: SnapState,
  params: HandlerParams,
) => {
  if (!params[0]) {
    throw ethErrors.rpc.invalidParams('Missing parameter: seed');
  }

  try {
    return recoverAccount(state, params[0]);
  } catch (e) {
    console.error('Failed to get account from seed', e);
    return null;
  }
};

export const getAccountsHandler = async () => {
  try {
    // TODO: Will return no accounts since we don't persist any state yet
    // const imported = Object.values(state.wallet.accountMap).map(
    //   (a) => a.address,
    // );
    const { address } = await getDefaultKeyringPair();
    return [address];
  } catch (e) {
    console.error('Failed to get accounts', e);
    return null;
  }
};

export const signSignerPayloadJSONHandler = async (
  api: PolkadotAPI,
  params: HandlerParams,
) => {
  const payload = params[0];
  if (!payload) {
    throw ethErrors.rpc.invalidParams('Missing parameter: signerPayloadJSON');
  }

  try {
    return await signSignerPayloadJSON(api, params[0]);
  } catch (e) {
    console.error('Failed to sign payload', e);
    return null;
  }
};

export const signAndSendExtrinsicTransactionHandler = async (
  api: PolkadotAPI,
  params: HandlerParams,
) => {
  const payload = params[0];
  if (!payload) {
    throw ethErrors.rpc.invalidParams('Missing parameter: signerPayloadJSON');
  }

  try {
    return await signAndSendExtrinsicTransaction(api, payload);
  } catch (e) {
    console.error('Failed to sign transaction', e);
    return null;
  }
};
