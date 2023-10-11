import { decrypt, encrypt } from '@metamask/browser-passworder';
import { JsonBIP44CoinTypeNode } from '@metamask/key-tree';

import { KeyPairFactory } from '../account';
import { getBip44Entropy } from './bip';
import { SnapStorage } from './storage';

const getPrivateKey = async (): Promise<string> => {
  const entropy: JsonBIP44CoinTypeNode = await getBip44Entropy(
    KeyPairFactory.coinType,
  );
  if (!entropy.privateKey) {
    // This should never happen
    throw new Error('No entropy.privateKey');
  }
  return entropy.privateKey;
};

export class EncryptedSnapStorage {
  static async load(): Promise<unknown> {
    const encryptedState = await SnapStorage.load();
    const privateKey = await getPrivateKey();
    const encryptedStateString = JSON.stringify(encryptedState);
    const stateString = await decrypt(privateKey, encryptedStateString);
    return JSON.parse(stateString as string);
  }

  static async save(state: any): Promise<void> {
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
