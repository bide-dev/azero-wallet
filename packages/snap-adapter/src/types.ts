import { SignerPayloadJSON } from '@polkadot/types/types';

export interface PublicAccount {
    address: string;
    viewKey: string;
}

export interface PublicAccountWithSeed extends PublicAccount {
    seed: string;
}

export type RpcRequest = {
    isEnabled: () => Promise<boolean>;
    getAccountFromSeed: (seed: string) => Promise<PublicAccount>;
    generateNewAccount: () => Promise<PublicAccount>;
    signAndSendExtrinsicTransaction: (transaction: SignerPayloadJSON) => Promise<{ signature: string }>;
    getAccounts: () => string[];
};

export type RpcParams = {
    [Key in keyof RpcRequest]: {
        method: Key;
        params: Parameters<RpcRequest[Key]>;
    };
}[keyof RpcRequest];

export type RpcMethod = keyof RpcRequest;

export type RpcResponse = {
    [Key in keyof RpcRequest]: ReturnType<RpcRequest[Key]>;
}[keyof RpcRequest];
