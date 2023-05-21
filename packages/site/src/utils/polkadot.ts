import { ApiPromise, WsProvider } from '@polkadot/api';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { TransactionPayload } from 'azero-snap-adapter';

export const getApi = async () => {
  const wsProvider = new WsProvider('wss://ws.test.azero.dev/');
  return ApiPromise.create({ provider: wsProvider });
};

export async function generateTransactionPayload(
  api: ApiPromise,
  from: string,
  to: string,
  amount: string | number,
): Promise<TransactionPayload> {
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
    transaction: transaction.toHex(),
  };
}
