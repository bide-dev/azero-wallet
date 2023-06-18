import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { initWasm } from '@polkadot/wasm-crypto/initOnlyAsm';
import { ethErrors } from 'eth-rpc-errors';

import {
  getAccountHandler,
  signAndSendExtrinsicTransactionHandler,
  signSignerPayloadJSONHandler,
} from './handlers';
import { PolkadotAPI } from './polkadot-api';

// let entropy: Bip44Node;
// let state: SnapState;
let api: PolkadotAPI;

initWasm().catch(console.error);

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
    // TODO: Naked fetch calls to test.azero.dev fails with a CORS error because snaps
    //   are running in a seperate iframe and so their origin is set to `null`.
    // TODO: Remove before deployment
    const defaultNode = 'http://3.140.2.107:9933';
    api = new PolkadotAPI(defaultNode);

    await api.init();
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
    case 'getAccount':
      return getAccountHandler();

    // Transaction methods
    case 'signAndSendTransactionPayload':
      return await signAndSendExtrinsicTransactionHandler(api, params);
    case 'signSignerPayloadJSON':
      return await signSignerPayloadJSONHandler(api, params);

    default:
      throw ethErrors.rpc.methodNotFound({
        data: { request: { method, params } },
      });
  }
};
