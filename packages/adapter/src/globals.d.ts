/* eslint-disable import/unambiguous */

import type { MetaMaskInpageProvider } from '@metamask/providers';

declare global {
  // Eslint doesn't like this, but it's the only way to extend the window object.
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}
