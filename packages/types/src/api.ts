import type {
  SignAndSendTransactionRequestParams,
  SignSignerPayloadRequestParams,
} from './params.js';
import type { Result, TransactionInfo } from './results.js';

export type AlephApi = {
  getAccount(): Promise<Result<string>>;
  signAndSendTransaction(
    payload: SignAndSendTransactionRequestParams,
  ): Promise<Result<TransactionInfo>>;
  signSignerPayload(
    payload: SignSignerPayloadRequestParams,
  ): Promise<Result<string>>;
};
