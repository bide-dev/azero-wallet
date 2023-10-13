import { SignerPayloadJSON } from '@polkadot/types/types';

export type TransactionPayload = {
  transaction: string; // TODO HexString?
  payload: SignerPayloadJSON;
};

export type SignAndSendTransactionRequestParams = {
  payload: TransactionPayload;
};

export type SignSignerPayloadRequestParams = {
  payload: SignerPayloadJSON;
};

export type TransferNativeAssetRequestParams = {
  recipient: string;
  amount: string;
};

export type SetRpcUrlRequestParams = {
  rpcUrl: string;
};
