import type { SnapsGlobalObject } from '@metamask/snaps-types';
import {
  Result,
  SignAndSendTransactionRequestParams,
  isError,
} from 'azero-wallet-types';

import { onRpcRequest } from '../../src';
import { PolkadotService } from '../../src/services/polkadot';
import {
  fakeSignature,
  fakeTransactionInfo,
  fakeTransactionPayload,
} from '../data/mocks';
import { SnapMock, createMockSnap } from '../helpers/snapMock';

jest
  .spyOn(PolkadotService, 'init')
  .mockImplementation(async () => Promise.resolve());

describe('signAndSendTransaction', () => {
  let snapMock: SnapsGlobalObject & SnapMock;

  beforeAll(async () => {
    snapMock = await createMockSnap();
    // eslint-disable-next-line no-restricted-globals
    global.snap = snapMock;
  });

  it('should sign and send transaction payload', async () => {
    const polkadotInitSpy = jest.spyOn(PolkadotService, 'init');
    const polkadotSignPayload = jest
      .spyOn(PolkadotService, 'signSignerPayload')
      .mockImplementation(async () => Promise.resolve(fakeSignature));
    const polkadotSignAndSendSpy = jest
      .spyOn(PolkadotService, 'sendTransactionWithSignature')
      .mockImplementation(async () => Promise.resolve(fakeTransactionInfo));

    const requestParams: SignAndSendTransactionRequestParams = {
      payload: fakeTransactionPayload,
    };
    const res = (await onRpcRequest({
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'signAndSendTransaction',
        params: requestParams,
      },
    })) as Result<unknown>;

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
