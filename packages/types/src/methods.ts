import type {
  SetRpcUrlRequestParams,
  SignAndSendTransactionRequestParams,
  SignSignerPayloadRequestParams,
  TransferNativeAssetRequestParams,
} from './params';

export type GetAccountRequest = {
  method: 'getAccount';
  params: undefined;
};

export type SignSignerPayloadRequest = {
  method: 'signSignerPayload';
  params: SignSignerPayloadRequestParams;
};

export type SignAndSendTransactionRequest = {
  method: 'signAndSendTransaction';
  params: SignAndSendTransactionRequestParams;
};

export type TransferNativeAssetRequest = {
  method: 'transferNativeAsset';
  params: TransferNativeAssetRequestParams;
};

export type SetRpcUrlRequest = {
  method: 'setRpcUrl';
  params: SetRpcUrlRequestParams;
};
