import type { JsonBIP44CoinTypeNode } from '@metamask/key-tree';
import { Keyring } from '@polkadot/keyring';
import type { KeyringPair } from '@polkadot/keyring/types';
import { stringToU8a } from '@polkadot/util';

import { getBip44Entropy } from './metamask/bip';

export type PublicAccount = {
  readonly address: string;
  readonly publicKey: string;
};

export type PrivateAccount = {
  readonly seed: string;
};

export class KeyPairFactory {
  static ss58Format = 42;

  static coinType = 643; // See: https://github.com/satoshilabs/slips/blob/master/slip-0044.md

  static fromSeed(seed: Uint8Array): KeyringPair {
    const keyring = new Keyring({
      ss58Format: KeyPairFactory.ss58Format,
      type: 'sr25519',
    });
    return keyring.addFromSeed(seed);
  }
}

export const generateKeyringFromBip44Entropy =
  async (): Promise<KeyringPair> => {
    const entropy: JsonBIP44CoinTypeNode = await getBip44Entropy(
      KeyPairFactory.coinType,
    );
    if (!entropy.privateKey) {
      throw new Error('No entropy.privateKey');
    }
    const seed = entropy.privateKey.slice(0, 32);
    const binSeed = stringToU8a(seed);
    return KeyPairFactory.fromSeed(binSeed);
  };

export const getDefaultKeyringPair = async (): Promise<KeyringPair> =>
  generateKeyringFromBip44Entropy();

export const getDefaultAddress = async (): Promise<string> => {
  const keyringPair = await getDefaultKeyringPair();
  return keyringPair.address;
};
