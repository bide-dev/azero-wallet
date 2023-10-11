import { ApiPromise, HttpProvider } from '@polkadot/api';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { SignerPayloadJSON } from '@polkadot/types/types';
import { HexString } from '@polkadot/util/types';
import { TransactionInfo, TransactionPayload } from 'azero-wallet-types';

import { getDefaultKeyringPair } from '../account';
import { showConfirmTransactionDialog } from '../metamask/ui';

export class PolkadotService {
  // TODO: Naked fetch calls to test.azero.dev fails with a CORS error because snaps
  //   are running in a separate iframe and so their origin is set to `null`.
  // TODO: Remove before deployment
  public static testAzeroDevURL = 'http://3.140.2.107:9933';

  // public static TEST_AZERO_DEV_URL = 'https://test.azero.dev/';
  public static azeroDevUrl = 'https://azero.dev/';

  public static api: ApiPromise;

  public static instance: PolkadotService;

  public static async init(
    rpcUrl: string = PolkadotService.azeroDevUrl,
  ): Promise<void> {
    const provider = new HttpProvider(rpcUrl);
    this.api = await ApiPromise.create({ provider });
    this.instance = this;
  }

  public static async sendTransactionWithSignature(
    txPayload: TransactionPayload,
    signature: HexString,
  ): Promise<TransactionInfo> {
    const sender = (await getDefaultKeyringPair()).address;
    const destination = txPayload.payload.address;

    const extrinsic = this.api.createType('Extrinsic', txPayload.transaction);
    extrinsic.addSignature(sender, signature, txPayload.payload);

    const amountJSON = extrinsic.args[1].toJSON();
    if (!amountJSON) {
      throw new Error('Amount is empty');
    }

    const amount = Number(amountJSON.toString());
    const paymentInfo = await this.api.tx.balances
      .transfer(destination, amount)
      .paymentInfo(sender);

    const txHash = await this.api.rpc.author.submitExtrinsic(extrinsic);

    return {
      amount,
      block: txHash.toHex(),
      destination,
      fee: paymentInfo.partialFee.toJSON(),
      hash: extrinsic.hash.toHex(),
      sender,
    };
  }

  public static async signAndSendExtrinsicTransaction(
    txPayload: TransactionPayload,
  ): Promise<TransactionInfo | null> {
    const signed = await PolkadotService.signSignerPayloadJSON(
      txPayload.payload,
    );
    if (!signed) {
      return null;
    }
    return PolkadotService.sendTransactionWithSignature(txPayload, signed);
  }

  public static async signSignerPayloadJSON(
    signerPayload: SignerPayloadJSON,
    showConfirmDialog = true,
  ): Promise<HexString | null> {
    const keyPair = await getDefaultKeyringPair();

    const confirmation = showConfirmDialog
      ? await showConfirmTransactionDialog(signerPayload, keyPair.address)
      : false;

    if (confirmation) {
      const extrinsic = this.api.registry.createType(
        'ExtrinsicPayload',
        signerPayload,
        {
          version: signerPayload.version,
        },
      );
      const { signature } = extrinsic.sign(keyPair);
      return signature;
    }
    return null;
  }
}

/**
 * Generate a transaction payload for a transfer.
 *
 * @param api - The Polkadot API.
 * @param from - The sender address.
 * @param to - The recipient address.
 * @param amount - The amount to send.
 */
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

  // Define transaction method
  const transaction: SubmittableExtrinsic<'promise'> = api.tx.balances.transfer(
    to,
    amount,
  );

  // Create SignerPayload
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
