import { ApiPromise, Keyring, WsProvider } from '@polkadot/api';
import {
  construct,
  decode,
  deriveAddress,
  getRegistry,
  methods,
  PolkadotSS58Format,
} from '@substrate/txwrapper-polkadot';

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

const constructTransfer = async (
  senderAddress: string,
  receiverAddress: string,
) => {
  const api = await getApi();

  const unsigned = api.tx.balances.transfer(receiverAddress, 1);

  const signedBlock = await api.rpc.chain.getBlock();

  const blockHash = signedBlock.block.header.hash;
  const blockNumber = signedBlock.block.header.number;
  const nonce = (await api.derive.balances.account(senderAddress)).accountNonce;
  const genesisHash = await api.rpc.chain.getBlockHash(0);
  const runtimeVersion = await api.rpc.state.getRuntimeVersion();
  const tip = 0; // Replace with the desired tip value (in the smallest currency denomination)

  const payload = {
    address: senderAddress,
    blockHash,
    blockNumber,
    era: api.registry.createType('ExtrinsicEra', {
      current: blockNumber,
      period: 1,
    }),
    genesisHash,
    method: unsigned.method.toHex(),
    nonce,
    runtimeVersion: runtimeVersion.specVersion,
    signedExtensions: [],
    tip,
    transactionVersion: runtimeVersion.transactionVersion,
  };

  // const decodedUnsigned = decode(unsigned, {
  //   metadataRpc,
  //   api.registry,
  // });
};

const signTransaction = async (transactionData: any, signer: any) => {
  const { api, unsignedTx } = transactionData;

  const { signature } = api.registry
    .createType('ExtrinsicPayload', unsignedTx, { version: 4 })
    .sign(signer);

  const signedTx = api.registry.createType('Extrinsic', {
    ...unsignedTx,
    signature,
  });

  return signedTx.toHex();
};

const submitSignedTransaction = async (serializedTx: string) => {
  const api = await getApi();
  const txHash = await api.rpc.author.submitExtrinsic(serializedTx);
  console.log('Transaction submitted with hash:', txHash.toHex());
};

const run = async () => {
  const sender = getKeyPair();
  const senderAddress = sender.address;

  // Send to self
  const unsignedTx = await constructTransfer(senderAddress, senderAddress);
  const serializedUnsignedTx = JSON.stringify(unsignedTx);

  const transactionData = JSON.parse(serializedUnsignedTx);
  const serializedSignedTx = await signTransaction(transactionData, sender);

  await submitSignedTransaction(serializedSignedTx);
};

run();
