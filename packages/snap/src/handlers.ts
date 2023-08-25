import { ethErrors } from 'eth-rpc-errors';
import {
  ark_bench,
  bench_ark,
  bench_jf_withdraw,
  jf_bench_withdraw,
} from 'wasmarking';

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
  } catch (error: unknown) {
    console.error('Failed to get account from seed', error);
    return null;
  }
};

export const getAccountHandler = async () => {
  try {
    // TODO: Will return no accounts since we don't persist any state yet
    // const imported = Object.values(state.wallet.accountMap).map(
    //   (a) => a.address,
    // );
    const { address } = await getDefaultKeyringPair();
    return address;
  } catch (error: unknown) {
    console.error('Failed to get accounts', error);
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

  const rpcUrl = params[1];
  const selectedApi = rpcUrl ? new PolkadotAPI(rpcUrl) : api;

  try {
    return await signSignerPayloadJSON(selectedApi, payload);
  } catch (error: unknown) {
    console.error('Failed to sign payload', error);
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

  const rpcUrl = params[1];
  const selectedApi = rpcUrl ? new PolkadotAPI(rpcUrl) : api;

  try {
    return await signAndSendExtrinsicTransaction(selectedApi, payload);
  } catch (error: unknown) {
    console.error('Failed to sign transaction', error);
    return null;
  }
};

export const benchmarkProverArkXor = async (params: HandlerParams) => {
  bench_ark('xor');
};
export const benchmarkProverArkWithdraw = async (params: HandlerParams) => {
  bench_ark('withdraw');
};

export const benchmarkProverJfWithdraw = async (params: HandlerParams) => {
  bench_jf_withdraw();
};

export const benchmarkKeyGenerationArkXor = async (params: HandlerParams) => {
  ark_bench('xor');
};

export const benchmarkKeyGenerationArkWithdraw = async (
  params: HandlerParams,
) => {
  ark_bench('withdraw');
};

export const benchmarkKeyGenerationJfWithdraw = async (
  params: HandlerParams,
) => {
  jf_bench_withdraw();
};
