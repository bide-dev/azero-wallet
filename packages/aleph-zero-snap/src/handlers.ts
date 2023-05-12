import { ethErrors } from 'eth-rpc-errors';
import { SubstrateApi } from 'substrate-api';
import { Bip44Node } from 'types';

import { generateAccountFromEntropy, recoverAccount, signTx } from './account';
import { SnapState } from './state';

type HandlerParams = unknown[] | Record<string, unknown>;

export const getAccountFromSeed = (state: SnapState, params: HandlerParams) => {
  console.log(`get_account_from_seed: ${JSON.stringify(params)}`);
  if (!params[0]) {
    throw ethErrors.rpc.invalidParams('Missing parameter: seed');
  }

  try {
    return recoverAccount(state, params[0]);
  } catch (e) {
    console.error('failed to get account from seed', e);
    return null;
  }
};

export const generateAccount = async (state: SnapState, entropy: Bip44Node) => {
  console.log(`generate_account`);
  try {
    return generateAccountFromEntropy(state, entropy);
  } catch (e) {
    console.error('failed to generate account', e);
    return null;
  }
};

export const isEnabled = () => true;

export const signTransaction = async (
  state: SnapState,
  params: HandlerParams,
  api: SubstrateApi,
) => {
  console.log(`signing transaction: ${JSON.stringify(params)}`);

  const transaction = params[0];
  if (!transaction) {
    throw ethErrors.rpc.invalidParams('Missing parameter: transaction');
  }

  try {
    return await signTx(state, params[0], api);
  } catch (e) {
    console.error('failed to sign transaction', e);
    return null;
  }
};

export const getAccounts = (state: SnapState) => {
  console.log('get accounts');
  try {
    return Object.values(state.wallet.accountMap).map((a) => a.address);
  } catch (e) {
    console.error('failed to get accounts', e);
    return null;
  }
};
