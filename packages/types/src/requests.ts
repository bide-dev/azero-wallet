import type {
  GetAccountRequest,
  SetRpcUrlRequest,
  SignAndSendTransactionRequest,
  SignSignerPayloadRequest,
  TransferNativeAssetRequest,
} from './methods';

export type AlephRPCRequest =
  | GetAccountRequest
  | SignSignerPayloadRequest
  | SignAndSendTransactionRequest
  | TransferNativeAssetRequest
  | SetRpcUrlRequest;

export type RequestMethod = AlephRPCRequest['method'];

export type RequestParameters = AlephRPCRequest['params'];

export type WalletEnableRequest = {
  method: 'wallet_enable';
  params: unknown[];
};

export type GetSnapsRequest = {
  method: 'wallet_getSnaps';
};

export type SnapRpcMethodRequest = {
  method: string;
  params: [AlephRPCRequest];
};

export type MetamaskRpcRequest =
  | WalletEnableRequest
  | GetSnapsRequest
  | SnapRpcMethodRequest;
