import { SubmittableExtrinsic } from '@polkadot/api/types';
import { ApiPromise } from '@polkadot/api';
import { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types';
import { hexToU8a, u8aToHex } from '@polkadot/util';
import { getApi, getKeyPair } from './utils';

type Transaction = {
  hash: string;
  block: string;
  sender: string;
  destination: string;
  amount: string | number;
  fee: string;
};

type TxPayload = {
  tx: string;
  payload: SignerPayloadJSON;
};

export async function generateTransactionPayload(
  api: ApiPromise,
  from: string,
  to: string,
  amount: string | number,
): Promise<TxPayload> {
  const signedBlock = await api.rpc.chain.getBlock();

  const account = await api.derive.balances.account(from);
  const nonce = account.accountNonce;
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
    tx: transaction.toHex(),
  };
}

export async function signPayloadJSON(
  api: ApiPromise,
  payload: SignerPayloadJSON,
): Promise<{ signature: string } | void> {
  const keyPair = getKeyPair();
  const extrinsic = api.registry.createType('ExtrinsicPayload', payload, {
    version: payload.version,
  });
  return extrinsic.sign(keyPair);
}

export async function signPayloadRaw(
  payload: SignerPayloadRaw,
): Promise<{ signature: string } | void> {
  const keyPair = getKeyPair();
  const signedBytes = keyPair.sign(hexToU8a(payload.data));
  return {
    signature: u8aToHex(signedBytes),
  };
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

  const amountJSON = extrinsic.args[1].toJSON();
  if (!amountJSON) {
    throw new Error('Amount is empty');
  }

  const amount = Number(amountJSON.toString());
  const paymentInfo = await api.tx.balances
    .transfer(destination, amount)
    .paymentInfo(sender);

  const txHash = await api.rpc.author.submitExtrinsic(extrinsic);

  return {
    amount,
    block: txHash.toHex(),
    destination,
    fee: paymentInfo.partialFee.toJSON(),
    hash: extrinsic.hash.toHex(),
    sender,
  };
}

const run = async () => {
  const api = await getApi();

  const payload = await generateTransactionPayload(
    api,
    getKeyPair().address,
    getKeyPair().address,
    1,
  );

  const signature = await signPayloadJSON(api, payload.payload);
  if (!signature) {
    throw new Error('Signature is empty');
  }

  const tx = await send(api, signature.signature as any, payload);
  console.log({ tx });

  await api.disconnect();
};

run();
