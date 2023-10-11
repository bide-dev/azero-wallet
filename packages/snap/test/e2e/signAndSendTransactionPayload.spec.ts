import type { SnapsGlobalObject } from '@metamask/snaps-types';
import { JsonRpcRequest } from '@metamask/snaps-types';
import {
  isError,
  Result,
  TransactionInfo,
  TransactionPayload,
} from 'azero-wallet-types';

import { onRpcRequest } from '../../src';
import { PolkadotService } from '../../src/services/polkadot';
import { createMockSnap, SnapMock } from '../helpers/snapMock';

jest
  .spyOn(PolkadotService, 'init')
  .mockImplementation(async () => Promise.resolve());

describe('signAndSendTransactionPayload', () => {
  let snapMock: SnapsGlobalObject & SnapMock;

  beforeAll(async () => {
    snapMock = await createMockSnap();
    // eslint-disable-next-line no-restricted-globals
    global.snap = snapMock;
  });

  it('should sign and send transaction payload', async () => {
    const txPayload: TransactionPayload = {
      transaction: '0x0000000',
      payload: {
        address: '5FjvBzjJq6x2',
        blockHash: '0x0000000',
        blockNumber: '0x0000000',
        era: '0x0000000',
        genesisHash: '0x0000000',
        method: '0x0000000',
        nonce: '0x0000000',
        specVersion: '0x0000000',
        tip: '0x0000000',
        transactionVersion: '0x0000000',
        signedExtensions: [],
        version: 0,
      },
    };
    const request = {
      origin: 'localhost',
      request: {
        id: 'test-id',
        jsonrpc: '2.0',
        method: 'signAndSendTransactionPayload',
        params: txPayload,
      },
    } as unknown as JsonRpcRequest;

    const polkadotInitSpy = jest.spyOn(PolkadotService, 'init');
    const fakeSignature = '0x0000000';
    const polkadotSignPayload = jest
      .spyOn(PolkadotService, 'signSignerPayloadJSON')
      .mockImplementation(async () => Promise.resolve(fakeSignature));
    const fakeTransactionInfo: TransactionInfo = {
      hash: '0x0000000',
      block: '0x0000000',
      sender: '0x0000000',
      destination: '0x0000000',
      amount: '0x0000000',
      fee: '0x0000000',
    };
    const polkadotSignAndSendSpy = jest
      .spyOn(PolkadotService, 'sendTransactionWithSignature')
      .mockImplementation(async () => Promise.resolve(fakeTransactionInfo));

    const res = (await onRpcRequest(request)) as Result<unknown>;

    expect(polkadotInitSpy).toHaveBeenCalled();
    expect(polkadotSignPayload).toHaveBeenCalled();
    expect(polkadotSignAndSendSpy).toHaveBeenCalled();

    if (isError(res)) {
      throw new Error(res.error);
    }

    expect(res.success).toBe(true);
    expect(res.data).toEqual(fakeTransactionInfo);
  });
});
