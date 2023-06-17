import { SignerPayloadJSON } from '@polkadot/types/types';

export type RpcRequest = {
  getAccounts: () => string[];
  signAndSendTransactionPayload: (
    payload: TransactionPayload,
    rpcUrl?: string,
  ) => Promise<TransactionInfo>;
  signSignerPayloadJSON: (
    payload: SignerPayloadJSON,
    rpcUrl?: string,
  ) => Promise<string>;
};

export type RpcParams = {
  [Key in keyof RpcRequest]: {
    method: Key;
    params: Parameters<RpcRequest[Key]>;
  };
}[keyof RpcRequest];

export type TransactionPayload = {
  transaction: string;
  payload: SignerPayloadJSON;
};

export type TransactionInfo = {
  hash: string;
  block: string;
  sender: string;
  destination: string;
  amount: string | number;
  fee: string;
};
