import { TransactionInfo, TransactionPayload } from 'azero-wallet-types';

export const fakeTransactionInfo: TransactionInfo = {
  hash: '0x0000000',
  block: '0x0000000',
  sender: '0x0000000',
  destination: '0x0000000',
  amount: '0x0000000',
  fee: '0x0000000',
};

export const fakeTransactionPayload: TransactionPayload = {
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

export const fakeSignature = '0x0000000';
