import type { SnapsGlobalObject } from '@metamask/snaps-types';
import { isError, Result } from 'azero-wallet-types';

import { onRpcRequest } from '../../src';
import { PolkadotService } from '../../src/services/polkadot';
import { createMockSnap, SnapMock } from '../helpers/snapMock';

jest
  .spyOn(PolkadotService, 'init')
  .mockImplementation(async () => Promise.resolve());

describe('getAccount', () => {
  let snapMock: SnapsGlobalObject & SnapMock;

  beforeAll(async () => {
    snapMock = await createMockSnap();
    // eslint-disable-next-line no-restricted-globals
    global.snap = snapMock;
  });

  it('should return an account', async () => {
    const res = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'getAccount',
        params: {},
      },
    })) as Result<unknown>;

    if (isError(res)) {
      throw new Error(res.error);
    }
    expect(res.success).toBe(true);
    expect(res.data).toBeDefined();
  });
});
