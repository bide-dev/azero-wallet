import {
  GetAccountResult,
  RequestMethod,
  RequestParameters,
  ResultObject,
  SetRpcUrlRequestParams,
  SignAndSendExtrinsicTransactionResult,
  SignAndSendTransactionRequestParams,
  SignSignerPayloadRequestParams,
  SignSignerPayloadResult,
  TransferNativeAssetRequestParams,
  TransferNativeAssetResult,
} from 'azero-wallet-types';
import { ethErrors } from 'eth-rpc-errors';

import { getDefaultAddress } from '../account';
import { PolkadotService } from './polkadot';
import { StorageService } from './storage';

export class SnapService {
  public static async handleRpcRequest(
    origin: string,
    method: RequestMethod,
    params: RequestParameters,
  ): Promise<ResultObject> {
    let res;

    switch (method) {
      case 'getAccount':
        res = await SnapService.getAccount();
        return ResultObject.success(res);

      // Transaction methods
      case 'signAndSendTransaction':
        res = await SnapService.signAndSendExtrinsicTransaction(
          params as SignAndSendTransactionRequestParams,
        );
        return ResultObject.success(res);

      case 'signSignerPayload':
        res = await SnapService.signSignerPayloadHandler(
          params as SignSignerPayloadRequestParams,
        );
        return ResultObject.success(res);

      case 'transferNativeAsset':
        res = await SnapService.transferNativeAsset(
          params as TransferNativeAssetRequestParams,
        );
        return ResultObject.success(res);

      case 'setRpcUrl':
        res = await SnapService.setRpcUrl(
          origin,
          params as SetRpcUrlRequestParams,
        );
        return ResultObject.success(res);

      default:
        throw ethErrors.rpc.methodNotFound({
          data: { request: { method, params } },
        });
    }
  }

  private static async getAccount(): Promise<GetAccountResult> {
    const address = await getDefaultAddress();
    return { address };
  }

  private static async signSignerPayloadHandler({
    payload,
  }: SignSignerPayloadRequestParams): Promise<SignSignerPayloadResult> {
    const signature = await PolkadotService.signSignerPayload(payload);
    return { signature };
  }

  private static async signAndSendExtrinsicTransaction({
    payload,
  }: SignAndSendTransactionRequestParams): Promise<SignAndSendExtrinsicTransactionResult> {
    const transaction = await PolkadotService.signAndSendExtrinsicTransaction(
      payload,
    );
    return { transaction };
  }

  private static async transferNativeAsset({
    amount,
    recipient,
  }: TransferNativeAssetRequestParams): Promise<TransferNativeAssetResult> {
    const sender = await getDefaultAddress();
    const payload = await PolkadotService.makeTransferTxPayload(
      sender,
      recipient,
      amount,
    );
    const transaction = await PolkadotService.signAndSendExtrinsicTransaction(
      payload,
    );
    return { transaction };
  }

  private static async setRpcUrl(
    origin: string,
    { rpcUrl }: SetRpcUrlRequestParams,
  ) {
    await StorageService.setRpcUrl(origin, rpcUrl);
    await PolkadotService.init(rpcUrl);
  }
}
