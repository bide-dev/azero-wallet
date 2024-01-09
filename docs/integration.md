---
layout: default
title: Integration Guide
nav_order: 4
---

# Integration guide

This document outlines the step-by-step process of integrating `azero-wallet` into a web app using React.

Aleph Zero Snap consists of three packages:

- [azero-wallet-snap]: The core snap functionality.
- [azero-wallet-adapter]: A wrapper to facilitate interaction with the snap API.
- [azero-wallet-types]: TypeScript types shared by the snap and snap API.

As a developer who wants to integrate the snap into a web app, you will primarily be interested
in `azero-wallet-adapter` and `azero-wallet-types` packages.

## Integration using `azero-wallet-adapter`

While direct integration with `azero-wallet` is possible, using [azero-wallet-adapter] is recommended for ease and
efficiency. This package contains the API methods exposed by the snap.

### End-to-end integration example

For a complete end-to-end integration example, see the [example app]. The example app is a React app that uses
`azero-wallet-adapter` to connect to the snap and sign transactions, sending $AZERO tokens from to itself.

### Installation

```bash
npm install azero-wallet-adapter
```

### Usage

Below we outline the usage of the `azero-wallet-adapter` package. For a complete list of methods and their parameters,
refer to the [API documentation](/snap).

First, we implement the `MetaMaskSnapSigner` class which we'll use to sign transactions in our app. `MetaMaskSnapSigner`
will connect to (and install, if needed) the snap and sign transactions using the snap API.

```typescript
import {signSignerPayload} from 'azero-wallet-adapter';
import type {SignerPayloadJSON} from '@polkadot/types/types';
import {ApiPromise} from '@polkadot/api';
import {connectSnap} from './snap';

export class MetaMaskSnapSigner {
  public async signPayload(payload: SignerPayloadJSON): Promise<SignerResult> {
    // Connect to snap
    await connectSnap();

    // Sign payload
    const signingResult = await signSignerPayload({payload});

    // Did that work?
    if (!signingResult.success) {
      throw new Error(signingResult.error);
    }

    return {
      signature: signingResult.data.signature
    };
  }

  // It is also possible to sing and send a transaction from within the snap using
  // the `signAndSendExtrinsicTransactionPayload` method.
  public async signAndSendPayload(api: ApiPromise): Promise<SignerResult> {
    // We generate the payloud outside of the snap
    const payload = await generateTransactionPayload(api); // see payload generating example below
    // We sign and send the payload from within the snap
    return await signAndSendExtrinsicTransactionPayload({payload});
  }
}
```

To learn more about generating a signer payload, see this [payload generating example].

For the `signPayload` method to work, the snap connection must be established. Below is the `connectSnap` function which
connects to the snap and sets up the RPC URL. Here, we use the public testnet RPC URL.

```typescript
import * as snap from 'azero-wallet-adapter';

export const connectSnap = async () => {
  // Actually connect to snap
  await snap.connect();

  // Set RPC URL - if we skip this part, we will connect to the default RPC URL at https://rpc.azero.dev/
  await snap.setRpcUrl({rpcUrl: 'https://rpc.test.azero.dev/'});

  // Get account
  const accountResult = await snap.getAccount();

  // Did that work?
  if (!accountResult.success) {
    throw accountResult.error;
  }
  const {address} = accountResult.data;
  console.log(`Connected to snap with account ${address}`);
};
```

In this function, `snap.connect()` is used to establish a connection to the snap. The RPC URL is then set
using `snap.setRpcUrl()`. Lastly, the account is fetched using `snap.getAccount()` and printed.

We see that snap API methods return a `Result` object. This object contains a `success` boolean and either an `error`
or `data` object. The `data` object contains the result of the API call. The `error` object contains the error message
if the API call failed.

---

[azero-wallet-adapter]:  https://www.npmjs.com/package/azero-wallet-adapter

[example app]: https://github.com/bide-dev/azero-wallet/tree/main/examples/site

[payload generating example]: https://github.com/bide-dev/azero-wallet/blob/113a9f2b1085c579d31167f79ba1dce2c6a17ef7/examples/site/src/utils/polkadot.ts#L10-L10
