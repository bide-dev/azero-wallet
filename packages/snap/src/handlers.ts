import { ethErrors } from 'eth-rpc-errors';

import {
  getDefaultKeyringPair,
  recoverAccount,
  signExtrinsicPayload,
  signSignerPayload,
} from './account';
import { SnapState } from './state';
import { SubstrateApi } from './substrate-api';

type HandlerParams = unknown[] | Record<string, unknown>;

export const importAccountFromSeedHandler = (
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

export const getAccountsHandler = async (state: SnapState) => {
  try {
    const imported = Object.values(state.wallet.accountMap).map(
      (a) => a.address,
    );
    const { address } = await getDefaultKeyringPair();
    return { imported, address };
  } catch (e) {
    console.error('Failed to get accounts', e);
    return null;
  }
};

export const signExtrinsicPayloadHandler = async (params: HandlerParams) => {
  const payloadJson = params[0];
  if (!payloadJson) {
    throw ethErrors.rpc.invalidParams('Missing parameter: payloadJson');
  }

  try {
    return await signExtrinsicPayload(payloadJson);
  } catch (e) {
    console.error('Failed to sign payload', e);
    return null;
  }
};

export const signSignerPayloadHandler = async (
  params: HandlerParams,
  api: SubstrateApi,
) => {
  const transaction = params[0];
  if (!transaction) {
    throw ethErrors.rpc.invalidParams('Missing parameter: transaction');
  }

  try {
    return await signSignerPayload(params[0], api);
  } catch (e) {
    console.error('Failed to sign payload', e);
    return null;
  }
};

// export const signAndSendExtrinsicTransactionHandler = async (
//   state: SnapState,
//   params: HandlerParams,
//   api: SubstrateApi,
// ) => {
//   const transaction = params[0];
//   if (!transaction) {
//     throw ethErrors.rpc.invalidParams('Missing parameter: transaction');
//   }
//
//   try {
//     return await signAndSendExtrinsicTransaction(state, params[0], api);
//   } catch (e) {
//     console.error('Failed to sign transaction', e);
//     return null;
//   }
// };
