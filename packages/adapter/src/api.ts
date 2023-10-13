import {
  GetAccountResult,
  SignAndSendExtrinsicTransactionResult,
  SignAndSendTransactionRequestParams,
  SignSignerPayloadRequestParams,
} from 'azero-wallet-types';

import { sendSnapMethod } from './metamask';

/**
 * Get the account address from snap.
 */
export const getAccount = async (): Promise<GetAccountResult> =>
  sendSnapMethod({
    method: 'getAccount',
  });

/**
 * Sign and send a transaction payload. Returns the transaction info.
 *
 * @param params - The transaction payload to sign and send.
 */
export const signAndSendExtrinsicTransactionPayload = async (
  params: SignAndSendTransactionRequestParams,
): Promise<SignAndSendExtrinsicTransactionResult> =>
  sendSnapMethod({
    method: 'signAndSendTransaction',
    params,
  });

/**
 * Sign a transaction payload.
 *
 * This function takes a transaction payload as a parameter and returns a promise that resolves to a signed transaction.
 *
 * @param params - The transaction payload to sign.
 */
export const signSignerPayload = async (
  params: SignSignerPayloadRequestParams,
): Promise<string> =>
  sendSnapMethod({
    method: 'signSignerPayload',
    params,
  });
