import { Keyring } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
import { hexToU8a, stringToU8a, u8aToHex } from '@polkadot/util';
import { SnapState } from 'state';

import { GenericExtrinsicPayload } from '@polkadot/types';
import { Bip44Node } from './types';
import { getBip44Entropy } from './metamask';

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

export const generateKeyringFromEntropy = async (
  bip44Node: Bip44Node,
): Promise<KeyringPair> => {
  const seed = bip44Node.key.slice(0, 32);
  const binSeed = stringToU8a(seed);
  return KeyPairFactory.fromSeed(binSeed);
};

export const getDefaultKeyringPair = async (): Promise<KeyringPair> => {
  const entropy = await getBip44Entropy(KeyPairFactory.COIN_TYPE);
  return await generateKeyringFromEntropy(entropy);
};

export const signExtrinsicPayload = async (
  payload: GenericExtrinsicPayload,
) => {
  const keyringPair = await getDefaultKeyringPair();
  return payload.sign(keyringPair);
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
