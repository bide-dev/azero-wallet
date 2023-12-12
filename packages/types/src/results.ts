import type { HexString } from '@polkadot/util/types';

export type Result<TData> = {
  success: boolean;
} & (
  | {
      success: true;
      data: TData;
    }
  | {
      success: false;
      error: string;
    }
);

export const isError = <TData>(
  result: Result<TData>,
): result is { success: false; error: string } => !result.success;

export const isSuccess = <TData>(
  result: Result<TData>,
): result is { success: true; data: TData } => result.success;

export class ResultObject {
  static success<TData>(data: TData): Result<TData> {
    return { success: true, data };
  }

  static error<TData>(error: string): Result<TData> {
    return { success: false, error };
  }
}

export type GetAccountResult = {
  address: string; // TODO: HexString?
};

export type SignSignerPayloadResult = {
  signature: HexString;
};

export type TransactionInfo = {
  hash: string;
  block: string;
  sender: string;
  destination: string;
  amount: string | number;
  fee: string;
};

export type SignAndSendExtrinsicTransactionResult = {
  transaction: TransactionInfo;
};

export type TransferNativeAssetResult = {
  transaction: TransactionInfo;
};
