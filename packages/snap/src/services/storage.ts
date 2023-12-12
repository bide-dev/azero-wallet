import type { AlephState, AlephWalletState } from 'azero-wallet-types';

import { CURRENT_STATE_VERSION } from '../const';
import { SnapStorage } from '../metamask/storage';

const clone = (object: any) => JSON.parse(JSON.stringify(object));

const emptyAccountState = {} as AlephWalletState;

export const getEmptyAccountState = () => clone(emptyAccountState);

const initialSnapState: AlephState = {
  v1: {
    walletState: {},
    currentAccount: '',
    config: {
      domainConfig: {},
    },
  },
};

export const getInitialSnapState = () => clone(initialSnapState);

const STATE_VERSION = 'v1';
export class StorageService {
  static instance: AlephState;

  static async init(): Promise<void> {
    const state = await SnapStorage.load();

    if (!state) {
      this.instance = getInitialSnapState();
      return;
    }

    // TODO: Write migration logic when state version changes
    if (CURRENT_STATE_VERSION !== STATE_VERSION) {
      throw new Error(
        `Invalid state version. Expected ${
          CURRENT_STATE_VERSION as string
        }, got ${STATE_VERSION as string}`,
      );
    }

    this.instance = state;
  }

  static get(): AlephState {
    return this.instance;
  }

  static set(state: AlephState): void {
    this.instance = state;
  }

  static async save(): Promise<void> {
    await SnapStorage.save(this.instance);
  }

  static async setRpcUrl(origin: string, rpcUrl: string): Promise<void> {
    const domainConfig = this.instance.v1.config.domainConfig[origin] ?? {};
    domainConfig.rpcUrl = rpcUrl;
    this.instance.v1.config.domainConfig[origin] = domainConfig;
    await this.save();
  }
}
