import { AlephState, AlephWalletState } from 'azero-wallet-types';

import { PolkadotService } from '../../src/services/polkadot';
import { getEmptyAccountState } from '../../src/services/storage';

const defaultSnapState = (address: string): AlephState => {
  const walletState: Record<string, AlephWalletState> = {};
  walletState[address] = getEmptyAccountState();

  return {
    v1: {
      walletState,
      currentAccount: address,
      config: {
        rpcUrl: PolkadotService.testAzeroDevURL,
      },
    },
  };
};

export const getDefaultSnapState = (address: string): AlephState => {
  const state = structuredClone(defaultSnapState(address));
  return structuredClone(state);
};
