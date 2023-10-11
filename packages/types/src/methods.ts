import type {
  SignAndSendTransactionPayloadRequestParams,
  SignSignerPayloadJSONRequestParams,
} from './params';

export type GetAccountRequest = {
  method: 'getAccount';
};

export type SignSignerPayloadJSONRequest = {
  method: 'signSignerPayloadJSON';
  params: SignSignerPayloadJSONRequestParams;
};

export type SignAndSendTransactionRequest = {
  method: 'signAndSendTransactionPayload';
  params: SignAndSendTransactionPayloadRequestParams;
};

// TODO: Add "set rpc url method"
