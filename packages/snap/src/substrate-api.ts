import { ApiPromise, HttpProvider } from '@polkadot/api';
import { SignerPayloadJSON } from '@polkadot/types/types';

export class SubstrateApi {
  static AZERO_DEV_URL = 'https://test.azero.dev/';

  public inner: ApiPromise;

  constructor(public readonly url: string) {}

  async init() {
    const provider = new HttpProvider(this.url);
    this.inner = await ApiPromise.create({ provider });
  }
}
