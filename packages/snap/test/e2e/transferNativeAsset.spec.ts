import type { SnapsGlobalObject } from '@metamask/snaps-types';
import { JsonRpcRequest } from '@metamask/snaps-types';
import {
  isError,
  Result,
  TransferNativeAssetRequestParams,
} from 'azero-wallet-types';

import { onRpcRequest } from '../../src';
import { PolkadotService } from '../../src/services/polkadot';
import { fakeTransactionInfo, fakeTransactionPayload } from '../data/mocks';
import { createMockSnap, SnapMock } from '../helpers/snapMock';

jest
  .spyOn(PolkadotService, 'init')
  .mockImplementation(async () => Promise.resolve());

describe('transferNativeAsset', () => {
  let snapMock: SnapsGlobalObject & SnapMock;

  beforeAll(async () => {
    snapMock = await createMockSnap();
    // eslint-disable-next-line no-restricted-globals
    global.snap = snapMock;
  });

  it('should sign and send a transaction to transfer the native asset', async () => {
    const polkadotInitSpy = jest.spyOn(PolkadotService, 'init');
    const makeTransferTxSpy = jest
      .spyOn(PolkadotService, 'makeTransferTxPayload')
      .mockImplementation(async () => fakeTransactionPayload);
    const polkadotSignAndSendSpy = jest
      .spyOn(PolkadotService, 'signAndSendExtrinsicTransaction')
      .mockImplementation(async () => Promise.resolve(fakeTransactionInfo));

    const requestParams: TransferNativeAssetRequestParams = {
      recipient: '5FjvBzjJq6x2',
      amount: '0x0000000', // TODO: Change to a real amount
    };
    const request = {
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'transferNativeAsset',
        params: requestParams,
      },
    } as unknown as JsonRpcRequest;
    const res = (await onRpcRequest(request)) as Result<unknown>;

    expect(polkadotInitSpy).toHaveBeenCalled();
    expect(makeTransferTxSpy).toHaveBeenCalled();
    expect(polkadotSignAndSendSpy).toHaveBeenCalled();

    if (isError(res)) {
      throw new Error(res.error);
    }
    expect(res.success).toBe(true);
    expect(res.data).toEqual({ transaction: fakeTransactionInfo });
  });
});
