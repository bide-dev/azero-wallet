import {
  GetAccountResult,
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
    method: string,
    params: any,
  ) {
    let res;
    switch (method) {
      // Account methods
      // TODO: Support account recovery
      // case 'importAccountFromSeed':
      //   return await importAccountFromSeedHandler(state, params);
      case 'getAccount':
        res = await SnapService.getAccount();
        return ResultObject.success(res);

      // Transaction methods
      case 'signAndSendTransaction':
        res = await SnapService.signAndSendExtrinsicTransaction(params);
        return ResultObject.success(res);

      case 'signSignerPayload':
        res = await SnapService.signSignerPayloadHandler(params);
        return ResultObject.success(res);

      case 'transferNativeAsset':
        res = await SnapService.transferNativeAsset(params);
        return ResultObject.success(res);

      case 'setRpcUrl':
        res = await SnapService.setRpcUrl(origin, params);
        return ResultObject.success(res);

      default:
        throw ethErrors.rpc.methodNotFound({
          data: { request: { method, params } },
        });
    }
  }

  // TODO: Implement account recovery/import
  // private static async importAccountFromSeed(
  //   state: SnapState,
  //   params: HandlerParams,
  // ) {
  //   if (!params[0]) {
  //     throw ethErrors.rpc.invalidParams('Missing parameter: seed');
  //   }
  //
  //   try {
  //     return recoverAccount(state, params[0]);
  //   } catch (error: unknown) {
  //     console.error('Failed to get account from seed', error);
  //     return null;
  //   }
  // }

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
