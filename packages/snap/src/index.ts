import { ethErrors } from 'eth-rpc-errors';
import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { initWasm } from '@polkadot/wasm-crypto/initOnlyAsm';

import { SnapState } from './state';
import {
  getAccountsHandler,
  signExtrinsicPayloadHandler,
  signSignerPayloadHandler,
} from './handlers';
import { SubstrateApi } from './substrate-api';

// let entropy: Bip44Node;
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

  if (!api) {
    console.info('Initializing Substrate API');

    // TODO: Naked fetch calls to test.azero.dev fails with a CORS error because snaps
    //   are running in a seperate iframe and so their origin is set to `null`.
    // TODO: Remove before deployment
    const localNode = 'http://localhost:9933';
    api = new SubstrateApi(localNode);

    await api.init();
    console.info('Initialized Substrate API');
  }

  // TODO: We don't persist any state yet
  // console.info('Creating SnapState from persisted data');
  // state = await SnapState.fromPersisted(entropy);
  // console.info('Created SnapState from persisted data');

  switch (method) {
    // Account methods
    // TODO: Support account recovery
    // case 'importAccountFromSeed':
    //   return await importAccountFromSeedHandler(state, params);
    case 'getAccounts':
      return getAccountsHandler(state);

    // Transaction methods
    case 'signExtrinsicPayload':
      return await signExtrinsicPayloadHandler(params);
    // case 'signAndSendExtrinsicTransaction':
    //   return await signAndSendExtrinsicTransactionHandler(state, params, api);

    case 'signSignerPayload':
      return await signSignerPayloadHandler(params, api);

    default:
      throw ethErrors.rpc.methodNotFound({
        data: { request: { method, params } },
      });
  }
};
