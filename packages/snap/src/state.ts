import * as passworder from '@metamask/browser-passworder';
import { Mutex } from 'async-mutex';

import { PrivateAccount } from './account';
import { Bip44Node } from './types';

const getState = async (): Promise<any> => {
  return await snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' },
  });
};

const clearState = async (): Promise<void> => {
  await snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' },
  });
};

const updateState = async (newState: unknown): Promise<void> => {
  await snap.request({
    method: 'snap_manageState',
    params: { operation: 'update', newState },
  });
};

export class WalletState {
  constructor(
    public readonly accountMap: Record<string, PrivateAccount> = {},
  ) {}

  public importAccount(account: PrivateAccount): WalletState {
    return new WalletState({
      ...this.accountMap,
      [account.address]: account,
    });
  }
}

export class SnapState {
  private static readonly STATE_VERSION = 0;

  private readonly mutex: Mutex;

  constructor(
    public readonly entropy: Bip44Node,
    private walletState = new WalletState(),
  ) {
    this.mutex = new Mutex();
  }

  public get wallet(): WalletState {
    return this.walletState;
  }

  public static async fromPersisted(entropy: Bip44Node): Promise<SnapState> {
    const appState = await SnapState.readPersisted(entropy);
    return new SnapState(entropy, appState);
  }

  private static async readPersisted(entropy: Bip44Node): Promise<WalletState> {
    const state = await getState();
    if (!state) {
      return new WalletState();
    }

    if (state.version !== SnapState.STATE_VERSION) {
      throw new Error(`Invalid state version: ${state.version}`);
    }

    return await passworder.decrypt(entropy.key, state.encrypted.walletState);
  }

  public async setState(newState: WalletState): Promise<void> {
    await this.mutex.runExclusive(async () => {
      await this.persist(newState);
      this.walletState = newState;
    });
  }

  private async persist(newState: WalletState) {
    const encryptedState = {
      version: SnapState.STATE_VERSION,
      encrypted: {
        walletState: await passworder.encrypt(this.entropy.key, newState),
      },
    };
    await updateState(encryptedState);
  }

  public async deleteWallet(): Promise<void> {
    await this.setState(new WalletState());
  }
}
