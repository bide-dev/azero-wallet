import type { SnapsGlobalObject } from '@metamask/snaps-types';
import { JsonRpcRequest } from '@metamask/snaps-types';
import { isError, Result, SetRpcUrlRequestParams } from 'azero-wallet-types';

import { onRpcRequest } from '../../src';
import { PolkadotService } from '../../src/services/polkadot';
import { StorageService } from '../../src/services/storage';
import { createMockSnap, SnapMock } from '../helpers/snapMock';

jest
  .spyOn(PolkadotService, 'init')
  .mockImplementation(async () => Promise.resolve());

describe('setRpcUrl', () => {
  let snapMock: SnapsGlobalObject & SnapMock;

  beforeAll(async () => {
    snapMock = await createMockSnap();
    // eslint-disable-next-line no-restricted-globals
    global.snap = snapMock;
  });

  it('should set the rpc url', async () => {
    const polkadotInitSpy = jest.spyOn(PolkadotService, 'init');
    const setRpcUrlSpy = jest.spyOn(StorageService, 'setRpcUrl');

    const origin = 'localhost';
    expect(snapMock.snapState?.v1.config.domainConfig[origin]).toBeUndefined();

    const requestParams: SetRpcUrlRequestParams = {
      rpcUrl: 'wss://rpc.polkadot.io',
    };
    const request = {
      origin,
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'setRpcUrl',
        params: requestParams,
      },
    } as unknown as JsonRpcRequest;
    const res = (await onRpcRequest(request)) as Result<unknown>;

    expect(polkadotInitSpy).toHaveBeenCalledTimes(2); // Once for snap init, and once for setRpcUrl request
    expect(setRpcUrlSpy).toHaveBeenCalled();
    expect(snapMock.snapState?.v1.config.domainConfig[origin].rpcUrl).toEqual(
      requestParams.rpcUrl,
    );

    if (isError(res)) {
      throw new Error(res.error);
    }
    expect(res.success).toBe(true);
  });
});
