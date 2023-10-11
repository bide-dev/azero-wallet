import {
  ResultObject,
  SignAndSendTransactionPayloadRequestParams,
  SignSignerPayloadJSONRequestParams,
} from 'azero-wallet-types';
import { ethErrors } from 'eth-rpc-errors';

import { getDefaultKeyringPair } from '../account';
import { PolkadotService } from './polkadot';

export class SnapService {
  public static async handleRpcRequest(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    origin: string,
    method: string,
    params: any,
  ) {
    // const state = StorageService.get();

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
      case 'signAndSendTransactionPayload':
        res = await SnapService.signAndSendExtrinsicTransaction(params);
        return ResultObject.success(res);

      case 'signSignerPayloadJSON':
        res = await SnapService.signSignerPayloadJSONHandler(params);
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

  private static async getAccount() {
    const { address } = await getDefaultKeyringPair();
    return address;
  }

  private static async signSignerPayloadJSONHandler({
    payload,
  }: SignSignerPayloadJSONRequestParams) {
    return PolkadotService.signSignerPayloadJSON(payload);
  }

  private static async signAndSendExtrinsicTransaction({
    payload,
  }: SignAndSendTransactionPayloadRequestParams) {
    return PolkadotService.signAndSendExtrinsicTransaction(payload);
  }
}
