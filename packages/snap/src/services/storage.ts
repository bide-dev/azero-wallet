import { AlephState, AlephWalletState } from 'azero-wallet-types';

import { CURRENT_STATE_VERSION } from '../const';
import { SnapStorage } from '../metamask/storage';
import { PolkadotService } from './polkadot';

const clone = (object: any) => JSON.parse(JSON.stringify(object));

const emptyAccountState = {} as AlephWalletState;

export const getEmptyAccountState = () => clone(emptyAccountState);

const initialSnapState: AlephState = {
  v1: {
    walletState: {},
    currentAccount: '',
    config: {
      rpcUrl: PolkadotService.azeroDevUrl,
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

    this.instance = state as AlephState;
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

  static getWalletState(): AlephWalletState {
    return this.instance[CURRENT_STATE_VERSION].walletState[
      this.instance[CURRENT_STATE_VERSION].currentAccount
    ];
  }
}
