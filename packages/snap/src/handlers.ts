import { ethErrors } from 'eth-rpc-errors';

import {
  getDefaultKeyringPair,
  recoverAccount,
  signExtrinsicPayload,
} from './account';
import { SnapState } from './state';

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

export const getAccountsHandler = (state: SnapState) => {
  try {
    const imported = Object.values(state.wallet.accountMap).map((a) => a.address);
    const default = getDefaultKeyringPair().address;
    return {imported, default};
  } catch (e) {
    console.error('Failed to get accounts', e);
    return null;
  }
};

export const signExtrinsicPayloadHandler = async (
  params: HandlerParams,
) => {
  const payloadJson = params[0];
  if (!payloadJson) {
    throw ethErrors.rpc.invalidParams('Missing parameter: payloadJson');
  }

  try {
    return await signExtrinsicPayload(payloadJson);
  } catch (e) {
    console.error('Failed to sign transaction', e);
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
