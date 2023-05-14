import { ethErrors } from 'eth-rpc-errors';
import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { initWasm } from '@polkadot/wasm-crypto/initOnlyAsm';

import { KeyPairFactory } from './account';
import { SnapState } from './state';
import { Bip44Node } from './types';
import { SubstrateApi } from './substrate-api';
import {
  generateAccountHandler,
  getAccountFromSeedHandler,
  getAccountsHandler,
  // signAndSendExtrinsicTransactionHandler,
  signExtrinsicPayloadHandler,
} from './handlers';

let entropy: Bip44Node;
let state: SnapState;
let api: SubstrateApi;

initWasm().catch((err) => console.error(err));

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}): Promise<any> => {
  console.info({
    origin: JSON.stringify(origin),
    request: JSON.stringify(request),
  });
  const { method, params } = request;

  if (!entropy) {
    console.info('Requesting entropy');
    // Disabling lint because we want to have control over when wasm is initialized
    // eslint-disable-next-line require-atomic-updates
    entropy = await snap.request({
      method: `snap_getBip44Entropy`,
      params: {
        coinType: KeyPairFactory.COIN_TYPE,
      },
    });
    console.info('Received entropy');
  }

  // TODO: Fix CORS failing because of `null` origin set by SES in fetch API
  // if (!api) {
  //   console.info('Initializing Substrate API');
  //
  //   // TODO: Remove before deployment
  //   const proxyUrl = 'http://localhost:3000/';
  //   api = new SubstrateApi(proxyUrl);
  //
  //   await api.init();
  //   console.info('Initialized Substrate API');
  // }

  console.info('Creating SnapState from persisted data');
  state = await SnapState.fromPersisted(entropy);
  console.info('Created SnapState from persisted data');

  switch (method) {
    // Account methods
    case 'getAccountFromSeed':
      return await getAccountFromSeedHandler(state, params);
    case 'generateNewAccount':
      return await generateAccountHandler(state, entropy);
    case 'getAccounts':
      return getAccountsHandler(state);

    // Transaction methods
    case 'signExtrinsicPayload':
      return await signExtrinsicPayloadHandler(state, params);
    // case 'signAndSendExtrinsicTransaction':
    //   return await signAndSendExtrinsicTransactionHandler(state, params, api);

    default:
      throw ethErrors.rpc.methodNotFound({
        data: { request: { method, params } },
      });
  }
};
