import { requestSnap } from './metamask';
import { SignerPayloadJSON } from '@polkadot/types/types';
import { TransactionInfo, TransactionPayload } from './types';

// TODO: Add docs

/**
 * Get the account address from snap.
 */
export const getAccount = async (): Promise<string> => {
  return await requestSnap('getAccount');
};

/**
 * Sign and send a transaction payload. Returns the transaction info.
 * @param payload - The transaction payload to sign and send.
 * @param [rpcUrl] - The RPC URL to use for sending the transaction.
 */
export const signAndSendTransactionPayload = async (
  payload: TransactionPayload,
  rpcUrl?: string,
): Promise<TransactionInfo> => {
  return await requestSnap('signAndSendTransactionPayload', [payload, rpcUrl]);
};

/**
 * Sign a transaction payload. Returns the signed transaction.
 * @param payload - The transaction payload to sign.
 * @param [rpcUrl] - The RPC URL to use for signing the transaction.
 */
export const signSignerPayloadJSON = async (
  payload: SignerPayloadJSON,
  rpcUrl?: string,
): Promise<string> => {
  return await requestSnap('signSignerPayloadJSON', [payload, rpcUrl]);
};
