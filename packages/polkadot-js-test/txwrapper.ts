
import { getRegistry, createMetadata } from '@substrate/txwrapper-polkadot';


import {getApi, getKeyPair} from "./utils"
const constructTransfer = async (sender: any) => {
  const api = await getApi();
  const registry = getRegistry({ chainName: 'Azero', specName:'azero' });
  registry.setMetadata(createMetadata(registry, await api.rpc.state.getMetadata()));

  const { address, meta: { nonce } } = await api.query.system.account(sender.address);

  const tx = registry.createType('Call', {
    args: {
      dest: 'DESTINATION_ADDRESS',
      value: 10,
    },
    function: 'Balances.transferKeepAlive',
  });

  const unsignedTx = {
    address,
    blockHash: api.genesisHash.toHex(),
    blockNumber: registry.createType('BlockNumber', 0).toHex(),
    eraPeriod: 2400,
    expiry: registry.createType('BlockNumber', 2400).toHex(),
    genesisHash: api.genesisHash.toHex(),
    method: tx.toHex(),
    nonce,
    specVersion: 1,
    tip: 0,
    transactionVersion: 1,
  };

  return { api, unsignedTx };
};

const signTransaction = async (transactionData: any, signer: any) => {
  const { api, unsignedTx } = transactionData;

  const { signature } = api.registry.createType('ExtrinsicPayload', unsignedTx, { version: 4 }).sign(signer);

  const signedTx = api.registry.createType('Extrinsic', { ...unsignedTx, signature });

  return signedTx.toHex();
};

const submitSignedTransaction = async (serializedTx: string) => {
  const api = await getApi();
  const txHash = await api.rpc.author.submitExtrinsic(serializedTx);
  console.log('Transaction submitted with hash:', txHash.toHex());
};

const run = async () => {
  const sender = getKeyPair();
  const unsignedTx = await constructTransfer(sender);
  const serializedUnsignedTx = JSON.stringify(unsignedTx);

  const transactionData = JSON.parse(serializedUnsignedTx);
  const serializedSignedTx = await signTransaction(transactionData, sender);

  await submitSignedTransaction(serializedSignedTx);
};

run();
