import {
  SignAndSendTransactionPayloadRequestParams,
  SignSignerPayloadJSONRequestParams,
  TransactionInfo,
} from 'azero-wallet-types';

import { sendSnapMethod } from './metamask';

/**
 * Get the account address from snap.
 */
export const getAccount = async (): Promise<string> =>
  sendSnapMethod({
    method: 'getAccount',
  });

/**
 * Sign and send a transaction payload. Returns the transaction info.
 *
 * @param params - The transaction payload to sign and send.
 */
export const signAndSendTransactionPayload = async (
  params: SignAndSendTransactionPayloadRequestParams,
): Promise<TransactionInfo> =>
  sendSnapMethod({
    method: 'signAndSendTransactionPayload',
    params,
  });

/**
 * Sign a transaction payload. Returns the signed transaction.
 *
 * @param params - The transaction payload to sign.
 */
export const signSignerPayloadJSON = async (
  params: SignSignerPayloadJSONRequestParams,
): Promise<string> =>
  sendSnapMethod({
    method: 'signSignerPayloadJSON',
    params,
  });
