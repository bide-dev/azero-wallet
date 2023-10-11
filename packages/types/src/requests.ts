import type {
  GetAccountRequest,
  SignAndSendTransactionRequest,
  SignSignerPayloadJSONRequest,
} from './methods';

export type AlephRPCRequest =
  | GetAccountRequest
  | SignSignerPayloadJSONRequest
  | SignAndSendTransactionRequest;

export type Method = AlephRPCRequest['method'];

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
