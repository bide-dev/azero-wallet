import { SignerPayloadJSON } from '@polkadot/types/types';

export type RpcRequest = {
  getAccounts: () => string[];
  signExtrinsicPayload: (payloadJSON: SignerPayloadJSON) => Promise<{ signature: string }>;
};

export type RpcParams = {
    [Key in keyof RpcRequest]: {
        method: Key;
        params: Parameters<RpcRequest[Key]>;
    };
}[keyof RpcRequest];
