import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { initWasm } from '@polkadot/wasm-crypto/initOnlyAsm';
import {
  RequestMethod,
  RequestParameters,
  ResultObject,
} from 'azero-wallet-types';

import { PolkadotService } from './services/polkadot';
import { SnapService } from './services/snap';
import { StorageService } from './services/storage';

// Catching the error here to make sure that we print the error to the console
// before the snap crashes
// eslint-disable-next-line no-console
initWasm().catch(console.error);

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}): Promise<any> => {
  try {
    const { method, params } = request;

    await StorageService.init();
    await PolkadotService.init();

    return await SnapService.handleRpcRequest(
      origin,
      method as RequestMethod,
      params as RequestParameters,
    );
  } catch (error) {
    return ResultObject.error((error as Error).toString());
  }
};
