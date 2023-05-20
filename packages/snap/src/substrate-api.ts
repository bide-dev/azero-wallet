import { ApiPromise, HttpProvider } from '@polkadot/api';

export class SubstrateApi {
  static AZERO_DEV_URL = 'https://test.azero.dev/';

  public inner: ApiPromise;

  public readonly url: string;

  constructor(url: string) {
    this.url = url;
  }

  async init() {
    const provider = new HttpProvider(this.url);
    this.inner = await ApiPromise.create({ provider });
  }
}
