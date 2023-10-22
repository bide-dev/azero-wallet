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
    console.log({ origin, request });
    const { method, params } = request;

    console.log('Initiating StorageService');
    await StorageService.init();
    console.log('StorageService initiated');

    console.log('Initiating PolkadotService');
    await PolkadotService.init();
    console.log('PolkadotService initiated');

    return await SnapService.handleRpcRequest(
      origin,
      method as RequestMethod,
      params as RequestParameters,
    );
  } catch (error) {
    return ResultObject.error((error as Error).toString());
  }
};
