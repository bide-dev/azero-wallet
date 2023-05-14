import {ApiPromise, HttpProvider} from '@polkadot/api';
import {SignerPayloadJSON} from '@polkadot/types/types';

export class SubstrateApi {
  static AZERO_DEV_URL = 'https://test.azero.dev/';
  api: ApiPromise;

  constructor(private readonly url: string) {
  }

  async init() {
    const provider = new HttpProvider(this.url);
    this.api = await ApiPromise.create({provider});
  }

  createTxPayload(toSign: SignerPayloadJSON) {
    return this.api.registry.createType('ExtrinsicPayload', toSign, {
      version: toSign.version,
    });
  }
}
