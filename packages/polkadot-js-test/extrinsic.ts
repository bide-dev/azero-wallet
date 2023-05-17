import { ApiPromise, WsProvider } from '@polkadot/api';
import { EXTRINSIC_VERSION } from '@polkadot/types/extrinsic/v4/Extrinsic';


import { Keyring } from '@polkadot/keyring';

import { readFileSync } from 'fs';

const getKeyPair = () => {
  const json = readFileSync('./test-account.json', 'utf8');
  const jsonAccount = JSON.parse(json);
  const keyring = new Keyring({ type: 'sr25519' });
  const sender = keyring.addFromJson(jsonAccount);
  sender.unlock('alamakota1');
  return sender;
};

const getApi = async () => {
  const wsProvider = new WsProvider('wss://ws.test.azero.dev/');
  return ApiPromise.create({ provider: wsProvider });
};

const makeExtrinsicPayload = async (
  recipientAddress: string,
  senderAddress: string,
) => {
  const api = await getApi();

  const extrinsic = api.tx.balances.transfer(recipientAddress, 1);

  const signedBlock = await api.rpc.chain.getBlock();
  const blockHash = signedBlock.block.header.hash;
  const blockNumber = signedBlock.block.header.number;

  const genesisHash = await api.rpc.chain.getBlockHash(0);
  const nonce = (await api.derive.balances.account(senderAddress)).accountNonce;
  const runtimeVersion = await api.rpc.state.getRuntimeVersion();
  const tip = 0; // Replace with the desired tip value (in the smallest currency denomination)

  const unsignedPayload = {
    address: senderAddress,
    blockHash,
    blockNumber,
    era: api.registry.createType('ExtrinsicEra', {
      current: blockNumber,
      period: 1,
    }),
    genesisHash,
    method: extrinsic.method.toHex(),
    nonce,
    runtimeVersion: runtimeVersion.specVersion,
    signedExtensions: [],
    tip,
    transactionVersion: runtimeVersion.transactionVersion,
  };

  return api.registry.createType('ExtrinsicPayload', unsignedPayload, {
    version: EXTRINSIC_VERSION,
  });
};

const run = async () => {
  const address = getKeyPair().address;

  const extrinsicPayload = await makeExtrinsicPayload(address, address);
  console.log(extrinsicPayload);

};

run();
