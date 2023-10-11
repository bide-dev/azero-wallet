/* eslint-disable @typescript-eslint/naming-convention */
// Disabled to prevent errors with snap RPC method naming

import { BIP44CoinTypeNode } from '@metamask/key-tree';
import type { RequestArguments } from '@metamask/providers/dist/BaseProvider';
import type { Maybe } from '@metamask/providers/dist/utils';
import type { SnapsGlobalObject } from '@metamask/snaps-types';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { initWasm } from '@polkadot/wasm-crypto/initOnlyAsm';
import { AlephState } from 'azero-wallet-types';

import { account, mnemonic } from '../data/constants';

type ISnapMock = {
  request<T>(args: RequestArguments): Promise<Maybe<T>>;
  resetHistory(): void;
};
type SnapManageState = {
  operation: 'get' | 'update' | 'clear';
  newState: unknown;
};

export class SnapMock implements ISnapMock {
  private snapState: AlephState | null = null;

  private snapManageState(params: SnapManageState): AlephState | null {
    if (!params) {
      return null;
    }
    if (params.operation === 'get') {
      return this.snapState;
    }
    if (params.operation === 'update') {
      this.snapState = params.newState as AlephState;
    } else if (params.operation === 'clear') {
      this.snapState = null;
    }

    return null;
  }

  private static snapGetEntropy(params: {
    version: string;
    salt: string;
  }): string {
    if (params.salt === undefined) {
      return '0x38c7ca42e6b9d38542b2746b63b2736924e3951bcefd9a93eab3b5a9b7eee213';
    }

    switch (params.salt.toLowerCase()) {
      case '0xb6665128ee91d84590f70c3268765384a9cafbcd':
        return '0x175480a60edda2be58d261a77ae5613c9d4650bf420a64b6cda4b4ca877f2bd0';
      case '0x461e557a07ac110bc947f18b3828e26f013dac39':
        return '0xe9a9242738e945f28a62082a27bf2325c81a63c192ca74286e8e9fdf6b6bae77';
      default:
        return '0x1111111111111111111111111111111111111111111111111111111111111111';
    }
  }

  // private async snapEthCall(data: any[]): Promise<string> {
  //   const apiKey = 'NRFBwig_CLVL0WnQLY3dUo8YkPmW-7iN';
  //   const provider = new AlchemyProvider('goerli', apiKey);
  //   return provider.call({
  //     ...data[0],
  //     blockTag: data[1],
  //   } as TransactionRequest);
  // }

  // private async snapEthLogs(data: any[]): Promise<unknown> {
  //   const apiKey = 'NRFBwig_CLVL0WnQLY3dUo8YkPmW-7iN';
  //   const provider = new AlchemyProvider('goerli', apiKey);
  //   return provider.getLogs(data[0] as Filter);
  // }

  readonly rpcMocks = {
    snap_dialog: jest.fn().mockReturnValue(true),
    eth_requestAccounts: jest.fn().mockResolvedValue([account]),
    eth_chainId: jest.fn().mockResolvedValue('0x1'),
    net_version: jest.fn().mockResolvedValue('5'),
    snap_getBip44Entropy: jest
      .fn()
      .mockImplementation(async (params: { coinType: number }) => {
        const node = await BIP44CoinTypeNode.fromDerivationPath([
          `bip39:${mnemonic}`,
          `bip32:44'`,
          `bip32:${params.coinType}'`,
        ]);

        return node.toJSON();
      }),
    snap_getEntropy: jest
      .fn()
      .mockImplementation((params: { version: string; salt: string }) =>
        SnapMock.snapGetEntropy(params),
      ),
    snap_manageState: jest
      .fn()
      .mockImplementation((params: unknown) =>
        this.snapManageState(params as SnapManageState),
      ),
  };

  async request<T>(args: RequestArguments): Promise<Maybe<T>> {
    const { method, params } = args;
    // eslint-disable-next-line
    return this.rpcMocks[method](params);
  }

  resetHistory(): void {
    Object.values(this.rpcMocks).forEach((mock) => mock.mockRestore());
  }
}

/**
 * Create a mock Snap instance.
 */
export async function createMockSnap(): Promise<SnapsGlobalObject & SnapMock> {
  await initWasm();
  await cryptoWaitReady();
  return new SnapMock() as SnapsGlobalObject & SnapMock;
}
