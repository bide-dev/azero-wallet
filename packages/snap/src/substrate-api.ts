import { ApiPromise, HttpProvider } from '@polkadot/api';
import { SignerPayloadJSON } from '@polkadot/types/types';

export class SubstrateApi {
  api: ApiPromise;

  constructor(private readonly url: string = 'https://test.azero.dev') {}

  async init() {
    const provider = new HttpProvider(this.url);
    this.api = await ApiPromise.create({ provider });
  }

  createTxPayload(toSign: SignerPayloadJSON) {
    return this.api.registry.createType('ExtrinsicPayload', toSign, {
      version: toSign.version,
    });
  }
}
