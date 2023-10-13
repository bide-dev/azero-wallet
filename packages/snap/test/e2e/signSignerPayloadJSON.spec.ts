import type { SnapsGlobalObject } from '@metamask/snaps-types';
import { JsonRpcRequest } from '@metamask/snaps-types';
import { isError, Result } from 'azero-wallet-types';

import { onRpcRequest } from '../../src';
import { PolkadotService } from '../../src/services/polkadot';
import { createMockSnap, SnapMock } from '../helpers/snapMock';

import {
  fakeSignature,
  fakeTransactionInfo,
  fakeTransactionPayload,
} from '../data/mocks';

jest
  .spyOn(PolkadotService, 'init')
  .mockImplementation(async () => Promise.resolve());

describe('signSignerPayload', () => {
  let snapMock: SnapsGlobalObject & SnapMock;

  beforeAll(async () => {
    snapMock = await createMockSnap();
    // eslint-disable-next-line no-restricted-globals
    global.snap = snapMock;
  });

  it('should sign a transaction payload', async () => {
    const polkadotInitSpy = jest.spyOn(PolkadotService, 'init');
    const polkadotSignPayload = jest
      .spyOn(PolkadotService, 'signSignerPayload')
      .mockImplementation(async () => Promise.resolve(fakeSignature));
    const polkadotSignAndSendSpy = jest
      .spyOn(PolkadotService, 'sendTransactionWithSignature')
      .mockImplementation(async () => Promise.resolve(fakeTransactionInfo));

    const request = {
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'signAndSendTransaction',
        params: fakeTransactionPayload,
      },
    } as unknown as JsonRpcRequest;
    const res = (await onRpcRequest(request)) as Result<unknown>;

    expect(polkadotInitSpy).toHaveBeenCalled();
    expect(polkadotSignPayload).toHaveBeenCalled();
    expect(polkadotSignAndSendSpy).toHaveBeenCalled();

    if (isError(res)) {
      throw new Error(res.error);
    }
    expect(res.success).toBe(true);
    expect(res.data).toEqual({ transaction: fakeTransactionInfo });
  });
});
