import {EXTRINSIC_VERSION} from '@polkadot/types/extrinsic/v4/Extrinsic';

import {hexToU8a, u8aToHex} from '@polkadot/util';
import {GenericExtrinsicPayload} from '@polkadot/types';

import {getApi, getKeyPair} from "./utils"

const makeExtrinsicPayload = async (
  recipientAddress: string,
  senderAddress: string,
) => {
  const api = await getApi();

  const extrinsicTx = api.tx.balances.transfer(recipientAddress, 1);

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
    method: extrinsicTx.method.toHex(),
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

export const signExtrinsicPayload = async (extrinsicPayloadHex: string) => {
  const keyPair = getKeyPair();

  const payloadAsU8a = hexToU8a(extrinsicPayloadHex);
  const payloadSignature = keyPair.sign(payloadAsU8a);
  return u8aToHex(payloadSignature);
};

export const send = async (
  extrinsicPayload: GenericExtrinsicPayload,
  signatureBytesHex: string,
  signerPk: Uint8Array,
) => {
  const api = await getApi();

  const signatureAsHex = api.registry
    .createType('Signature', signatureBytesHex)
    .toHex();

  const signedExtrinsic = api.registry.createType('Extrinsic', {
    method: extrinsicPayload.method,
    signature: api.registry.createType('Signature', hexToU8a(signatureAsHex)),
    signer: signerPk,
  });

  const txHash = await api.rpc.author.submitExtrinsic(signedExtrinsic);
  console.log('txHash: ', txHash.toHex());
};

const run = async () => {
  const address = getKeyPair().address;
  const signerPk = getKeyPair().publicKey;

  const extrinsicPayload = await makeExtrinsicPayload(address, address);
  const payloadAsHex = extrinsicPayload.toHex();

  const signatureBytesHex = await signExtrinsicPayload(payloadAsHex);

  await send(extrinsicPayload, signatureBytesHex, signerPk);
};

run();
