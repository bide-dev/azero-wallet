import type {
  SignAndSendTransactionPayloadRequestParams,
  SignSignerPayloadJSONRequestParams,
} from './params.js';
import type { Result, TransactionInfo } from './results.js';

export type AlephApi = {
  getAccount(): Promise<Result<string>>;
  signAndSendTransaction(
    payload: SignAndSendTransactionPayloadRequestParams,
  ): Promise<Result<TransactionInfo>>;
  signSignerPayloadJSON(
    payload: SignSignerPayloadJSONRequestParams,
  ): Promise<Result<string>>;
};
