import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { initWasm as initWasmPolkadot } from '@polkadot/wasm-crypto/initOnlyAsm';
import { InitOutput } from 'wasmarking';
import { ethErrors } from 'eth-rpc-errors';
import * as wasmarking from 'wasmarking';

import {
  benchmarkKeyGenerationArkWithdraw,
  benchmarkKeyGenerationArkXor,
  benchmarkKeyGenerationJfWithdraw,
  benchmarkProverArkWithdraw,
  benchmarkProverArkXor,
  benchmarkProverJfWithdraw,
  getAccountHandler,
  signAndSendExtrinsicTransactionHandler,
  signSignerPayloadJSONHandler,
} from './handlers';
import { PolkadotAPI } from './polkadot-api';
import { uint8ArrayFromHex } from './utils';
import { PROGRAM_WASM_HEX } from './wasm';

// let entropy: Bip44Node;
// let state: SnapState;
let api: PolkadotAPI;
let wasm: InitOutput;

initWasmPolkadot().catch(console.error);

const initializeWasmarking = async () => {
  try {
    const wasmBuffer = uint8ArrayFromHex(PROGRAM_WASM_HEX);
    const wasmModule = await WebAssembly.compile(wasmBuffer);
    wasm = await wasmarking.default(wasmModule);
  } catch (error) {
    console.error('Failed to initialize WebAssembly module.', error);
    throw error;
  }
};

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}): Promise<any> => {
  console.info({
    origin: JSON.stringify(origin),
    request: JSON.stringify(request),
  });
  const { method, params } = request;

  if (!wasm) {
    await initializeWasmarking();
  }

  // if (!api) {
  //   // TODO: Naked fetch calls to test.azero.dev fails with a CORS error because snaps
  //   //   are running in a seperate iframe and so their origin is set to `null`.
  //   // TODO: Remove before deployment
  //   const defaultNode = 'http://3.140.2.107:9933';
  //   api = new PolkadotAPI(defaultNode);
  //
  //   await api.init();
  // }

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

    case 'benchmarkProverArkXor':
      return await benchmarkProverArkXor(params);
    case 'benchmarkProverArkWithdraw':
      return await benchmarkProverArkWithdraw(params);
    case 'benchmarkProverJfWithdraw':
      return await benchmarkProverJfWithdraw(params);

    case 'benchmarkKeyGenerationArkXor':
      return await benchmarkKeyGenerationArkXor(params);
    case 'benchmarkKeyGenerationArkWithdraw':
      return await benchmarkKeyGenerationArkWithdraw(params);
    case 'benchmarkKeyGenerationJfWithdraw':
      return await benchmarkKeyGenerationJfWithdraw(params);

    default:
      throw ethErrors.rpc.methodNotFound({
        data: { request: { method, params } },
      });
  }
};
