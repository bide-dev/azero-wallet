import { SubmittableExtrinsic } from '@polkadot/api/types';
import { Transaction, TxPayload } from '@chainsafe/metamask-polkadot-types';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types';
import { hexToU8a, u8aToHex } from '@polkadot/util';

import { Keyring } from '@polkadot/keyring';

import { readFileSync } from 'fs';

function getKeyPair() {
  const json = readFileSync('./test-account.json', 'utf8');
  const jsonAccount = JSON.parse(json);
  const keyring = new Keyring({ type: 'sr25519' });
  const sender = keyring.addFromJson(jsonAccount);
  sender.unlock('alamakota1');
  return sender;
}

export async function generateTransactionPayload(
  api: ApiPromise,
  to: string,
  amount: string | number,
): Promise<{
  tx: string;
  payload: SignerPayloadJSON;
  payloadRaw: SignerPayloadRaw;
}> {
  // fetch last signed block and account address
  const [signedBlock, address] = await Promise.all([
    api.rpc.chain.getBlock(),
    getKeyPair().address,
  ]);
  // create signer options
  const nonce = (await api.derive.balances.account(address)).accountNonce;
  const signerOptions = {
    blockHash: signedBlock.block.header.hash,
    era: api.createType('ExtrinsicEra', {
      current: signedBlock.block.header.number,
      period: 50,
    }),
    nonce,
  };
  // define transaction method
  const transaction: SubmittableExtrinsic<'promise'> = api.tx.balances.transfer(
    to,
    amount,
  );

  // create SignerPayload
  const signerPayload = api.createType('SignerPayload', {
    genesisHash: api.genesisHash,
    runtimeVersion: api.runtimeVersion,
    version: api.extrinsicVersion,
    ...signerOptions,
    address: to,
    blockNumber: signedBlock.block.header.number,
    method: transaction.method,
    signedExtensions: [],
    transactionVersion: transaction.version,
  });
  return {
    payload: signerPayload.toPayload(),
    payloadRaw: signerPayload.toRaw(),
    tx: transaction.toHex(),
  };
}

export async function signPayloadJSON(
  api: ApiPromise,
  payload: SignerPayloadJSON,
): Promise<{ signature: string } | void> {
  const keyPair = getKeyPair();
  // const confirmation = await showConfirmationDialog(snap, {
  //   description: `It will be signed with address: ${keyPair.address}`,
  //   prompt: `Do you want to sign this message?`,
  //   textAreaContent: messageCreator([
  //     { message: 'address', value: payload.address },
  //     { message: 'tip', value: payload.tip },
  //     { message: 'block number', value: payload.blockNumber },
  //     { message: 'block hash', value: payload.blockHash },
  //     { message: 'genesis hash', value: payload.genesisHash },
  //     { message: 'era', value: payload.era },
  //     { message: 'nonce', value: payload.nonce },
  //     { message: 'spec version', value: payload.specVersion },
  //     { message: 'transaction version', value: payload.transactionVersion },
  //   ]),
  // });
  // if (confirmation) {
  const extrinsic = api.registry.createType('ExtrinsicPayload', payload, {
    version: payload.version,
  });
  return extrinsic.sign(keyPair);
  // }
}

export async function signPayloadRaw(
  payload: SignerPayloadRaw,
): Promise<{ signature: string } | void> {
  const keyPair = getKeyPair();
  // ask for confirmation
  // const confirmation = await showConfirmationDialog(snap, {
  //   description: `It will be signed with address: ${keyPair.address}`,
  //   prompt: `Do you want to sign this message?`,
  //   textAreaContent: payload.data,
  // });
  // return seed if user confirmed action
  // if (confirmation) {
  const signedBytes = keyPair.sign(hexToU8a(payload.data));
  return {
    signature: u8aToHex(signedBytes),
  };
  // }
}

export async function send(
  api: ApiPromise,
  signature: Uint8Array | `0x${string}`,
  txPayload: TxPayload,
): Promise<Transaction> {
  const sender = getKeyPair().address;
  const destination = txPayload.payload.address;

  const extrinsic = api.createType('Extrinsic', txPayload.tx);
  extrinsic.addSignature(sender, signature, txPayload.payload);

  const amount = extrinsic.args[1].toJSON();
  if (!amount) {
    throw new Error('Amount is empty');
  }
  const paymentInfo = await api.tx.balances
    .transfer(destination, Number(amount.toString()))
    .paymentInfo(sender);

  const txHash = await api.rpc.author.submitExtrinsic(extrinsic);

  const tx = {
    amount: amount,
    block: txHash.toHex(),
    destination: destination,
    fee: paymentInfo.partialFee.toJSON(),
    hash: extrinsic.hash.toHex(),
    sender: sender,
  } as Transaction;

  // await saveTxToState(snap, tx);
  return tx;
}

const run = async () => {
  // Connect to the Polkadot node
  const wsProvider = new WsProvider('wss://ws.test.azero.dev/');
  const api = await ApiPromise.create({ provider: wsProvider });

  const payload = await generateTransactionPayload(
    api,
    getKeyPair().address,
    1,
  );

  // const signature = await signPayloadJSON(api, payload.payload);
  const signature = await signPayloadRaw(payload.payloadRaw);
  if (!signature) {
    throw new Error('Signature is empty');
  }

  const tx = await send(api, signature.signature as any, payload);
  console.log({ tx });

  await api.disconnect();
  await wsProvider.disconnect();
};

run();
