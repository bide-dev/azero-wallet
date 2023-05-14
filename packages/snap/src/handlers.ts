import { ethErrors } from 'eth-rpc-errors';
import { SubstrateApi } from 'substrate-api';
import { Bip44Node } from 'types';

import {
  generateAccountFromEntropy,
  recoverAccount,
  signAndSendExtrinsicTransaction,
  signExtrinsicPayload,
} from './account';
import { SnapState } from './state';
import {GenericExtrinsicPayload} from "@polkadot/types";

type HandlerParams = unknown[] | Record<string, unknown>;

export const getAccountFromSeedHandler = (
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

export const generateAccountHandler = async (
  state: SnapState,
  entropy: Bip44Node,
) => {
  try {
    return generateAccountFromEntropy(state, entropy);
  } catch (e) {
    console.error('Failed to generate account', e);
    return null;
  }
};

export const getAccountsHandler = (state: SnapState) => {
  try {
    return Object.values(state.wallet.accountMap).map((a) => a.address);
  } catch (e) {
    console.error('Failed to get accounts', e);
    return null;
  }
};

export const signExtrinsicPayloadHandler = async (
  state: SnapState,
  params: HandlerParams,
) => {
  const payloadJson = params[0];
  if (!payloadJson) {
    throw ethErrors.rpc.invalidParams('Missing parameter: payloadJson');
  }

  const payload = GenericExtrinsicPayload.fromJson(payloadJson);

  try {
    return await signExtrinsicPayload(state, payloadJson);
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
