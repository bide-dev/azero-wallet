import { SignerPayloadJSON } from '@polkadot/types/types';

// TODO: Rename everywhere to signAndSendTransaction instead of signAndSendTransactionPayload

export type TransactionPayload = {
  transaction: string;
  payload: SignerPayloadJSON;
};

export type SignAndSendTransactionPayloadRequestParams = {
  payload: TransactionPayload;
};

export type SignSignerPayloadJSONRequestParams = {
  payload: SignerPayloadJSON;
};
