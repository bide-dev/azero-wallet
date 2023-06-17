import { requestSnap } from './metamask';
import { SignerPayloadJSON } from '@polkadot/types/types';
import { TransactionInfo, TransactionPayload } from './types';

// TODO: Add docs

export const getAccounts = async (): Promise<string[]> => {
  return await requestSnap('getAccounts');
};

export const signAndSendTransactionPayload = async (
  payload: TransactionPayload,
  rpcUrl?: string,
): Promise<TransactionInfo> => {
  return await requestSnap('signAndSendTransactionPayload', [payload, rpcUrl]);
};

export const signSignerPayloadJSON = async (
  payload: SignerPayloadJSON,
  rpcUrl?: string,
): Promise<string> => {
  return await requestSnap('signSignerPayloadJSON', [payload, rpcUrl]);
};
