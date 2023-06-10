import { ApiPromise, HttpProvider } from '@polkadot/api';
import { HexString } from '@polkadot/util/types';
import { TransactionInfo, TransactionPayload } from 'azero-wallet-adapter';

import { getDefaultKeyringPair } from './account';

export class PolkadotAPI {
  static AZERO_DEV_URL = 'https://test.azero.dev/';

  public inner: ApiPromise;

  public readonly url: string;

  constructor(url: string) {
    this.url = url;
  }

  public async init() {
    console.info('Initializing Substrate API');
    const provider = new HttpProvider(this.url);
    this.inner = await ApiPromise.create({ provider });
    console.info('Initialized Substrate API');
  }

  public async sendTransactionWithSignature(
    txPayload: TransactionPayload,
    signature: HexString,
  ): Promise<TransactionInfo> {
    const sender = (await getDefaultKeyringPair()).address;
    const destination = txPayload.payload.address;

    const extrinsic = this.inner.createType('Extrinsic', txPayload.transaction);
    extrinsic.addSignature(sender, signature, txPayload.payload);

    const amountJSON = extrinsic.args[1].toJSON();
    if (!amountJSON) {
      throw new Error('Amount is empty');
    }

    const amount = Number(amountJSON.toString());
    const paymentInfo = await this.inner.tx.balances
      .transfer(destination, amount)
      .paymentInfo(sender);

    const txHash = await this.inner.rpc.author.submitExtrinsic(extrinsic);

    return {
      amount,
      block: txHash.toHex(),
      destination,
      fee: paymentInfo.partialFee.toJSON(),
      hash: extrinsic.hash.toHex(),
      sender,
    };
  }
}
