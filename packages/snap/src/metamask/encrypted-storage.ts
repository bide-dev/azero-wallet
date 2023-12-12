import { decrypt, encrypt } from '@metamask/browser-passworder';
import type { JsonBIP44CoinTypeNode } from '@metamask/key-tree';

import type { AlephState } from 'azero-wallet-types';
import { KeyPairFactory } from '../account';
import { getBip44Entropy } from './bip';
import { SnapStorage } from './storage';

const getPrivateKey = async (): Promise<string> => {
  const entropy: JsonBIP44CoinTypeNode = await getBip44Entropy(
    KeyPairFactory.coinType,
  );
  if (!entropy.privateKey) {
    // This should never happen
    throw new Error('No private key found for the current account');
  }
  return entropy.privateKey;
};

export class EncryptedSnapStorage {
  static async load(): Promise<AlephState> {
    const encryptedState = await SnapStorage.load();
    const privateKey = await getPrivateKey();
    const encryptedStateString = JSON.stringify(encryptedState);
    const stateString = await decrypt(privateKey, encryptedStateString);
    return JSON.parse(stateString as string);
  }

  static async save(state: AlephState): Promise<void> {
    const stateString = JSON.stringify(state);
    const privateKey = await getPrivateKey();
    const encryptedStateString: string = await encrypt(privateKey, stateString);
    const encryptedState = JSON.parse(encryptedStateString);
    await SnapStorage.save(encryptedState);
  }

  static async clear(): Promise<void> {
    await SnapStorage.clear();
  }
}
