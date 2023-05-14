import { Keyring } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
import { SignerPayloadJSON } from '@polkadot/types/types';
import { hexToU8a, stringToU8a, u8aToHex } from '@polkadot/util';
import { ethErrors } from 'eth-rpc-errors';
import { SnapState } from 'state';
import { SubstrateApi } from 'substrate-api';

import { GenericExtrinsicPayload } from '@polkadot/types';
import { Bip44Node } from './types';

export type PrivateAccount = {
  seed: string;
} & PublicAccount;

export type PublicAccount = {
  address: string;
  publicKey: string;
};

export class KeyPairFactory {
  static SS58FORMAT = 42; // default

  static COIN_TYPE = 434; // kusama

  static fromSeed(seed: Uint8Array): KeyringPair {
    const keyring = new Keyring({
      ss58Format: KeyPairFactory.SS58FORMAT,
      type: 'sr25519',
    });
    return keyring.addFromSeed(seed);
  }
}

export const persistAccount = async (
  pair: PrivateAccount,
  state: SnapState,
) => {
  const newWalletState = state.wallet.importAccount(pair);
  await state.setState(newWalletState);
};

export const recoverAccount = async (
  state: SnapState,
  seed: string,
): Promise<PublicAccount> => {
  const pair = KeyPairFactory.fromSeed(hexToU8a(seed));

  const publicAccount: PublicAccount = {
    address: pair.address,
    publicKey: u8aToHex(pair.publicKey),
  };

  await persistAccount({ ...publicAccount, seed }, state);

  return publicAccount;
};

export const generateAccountFromEntropy = async (
  state: SnapState,
  bip44Node: Bip44Node,
): Promise<PublicAccount> => {
  // generate keys
  console.log({ bip44Node: JSON.stringify(bip44Node) });
  console.log({ bip44NodeKey: JSON.stringify(bip44Node.key) });
  const seed = bip44Node.key.slice(0, 32);
  const binSeed = stringToU8a(seed);

  const pair = KeyPairFactory.fromSeed(binSeed);

  const publicAccount: PublicAccount = {
    address: pair.address,
    publicKey: u8aToHex(pair.publicKey),
  };

  await persistAccount({ ...publicAccount, seed: u8aToHex(binSeed) }, state);

  return publicAccount;
};

export const signExtrinsicPayload = async (
  state: SnapState,
  payload: GenericExtrinsicPayload,
) => {
  const accounts = Object.values(state.wallet.accountMap);
  if (accounts.length < 1) {
    throw ethErrors.rpc.resourceNotFound(
      'No default account to sign transaction with',
    );
  }

  const account = accounts[0];
  const keyPair = KeyPairFactory.fromSeed(hexToU8a(account.seed));
  return payload.sign(keyPair);
};

// export const signAndSendExtrinsicTransaction = async (
//   state: SnapState,
//   payload: SignerPayloadJSON,
//   api: SubstrateApi,
// ) => {
//   const extrinsicPayload = api.inner.registry.createType(
//     'ExtrinsicPayload',
//     payload,
//     {
//       version: payload.version,
//     },
//   );
//   const signed = await signExtrinsicPayload(state, extrinsicPayload);
//   return api.inner.sendSignedTransaction(signed);
// };
