---
layout: default
title: Snap API docs
nav_order: 3
---

# Snap API Docs

This document explains how the workings of the snap and it's limitations.

## Account derivation

The snap implements a single Aleph Zero-compatible account. This account is derived automatically and deterministically
upon the snap startup. This implies a consistent account for a given MetaMask wallet. The deterministic derivation
eliminates the need for backing up the account seed phrase, just the MetaMask seed phrase is required.

### Limitations

- It's currently not possible to derive multiple accounts from a single MetaMask wallet.
- Exporting the account from the snap is not possible.
- Accounts may only be viewed using snap API calls, not from MetaMask interface.

## Snap methods

The snap avails the following methods:

### 1. Get Account Address

The `getAccount` method extracts the account address without needing any additional parameters.

```typescript
import {getAccount, isSuccess} from 'azero-wallet-adapter';

const result: Result<GetAccountResult> = await getAccount();
if (isSuccess(result)) {
  console.log(result.data); // {address: "account address"}
} else {
  console.error(result.error);
}
```

### 2. Sign and Send Payload

This method sends and signs a payload via the `SignAndSendTransactionRequestParams` type parameters.

```typescript
import {signAndSendExtrinsicTransactionPayload, SignAndSendTransactionRequestParams, isSuccess}
  from 'azero-wallet-adapter';

const txParams: SignAndSendTransactionRequestParams = {transaction: /*...*/, payload: /*...*/}

signAndSendExtrinsicTransactionPayload(txParams).then(result => {
  if (isSuccess(result)) {
    // handle result transaction
  } else {
    // handle error
  }
});
```

### 3. Sign Payload

This method signs a payload without sending it. It uses the `SignSignerPayloadRequestParams`.

```typescript
import {signSignerPayload, SignSignerPayloadRequestParams, isSuccess} from 'azero-wallet-adapter';

const signParams: SignSignerPayloadRequestParams = {payload: /*...*/};

signSignerPayload(signParams).then(result => {
  if (isSuccess(result)) {
    // handle result transaction
  } else {
    // handle error
  }
});
```

### 4. Transfer Native Assets

This function transfers native assets using the `TransferNativeAssetRequestParams` type for its parameters.

```typescript
import {transferNativeAsset, TransferNativeAssetRequestParams, isSuccess} from 'azero-wallet-adapter';

const transferParams: TransferNativeAssetRequestParams = {recipient: /*...*/, amount: /*...*/};

transferNativeAsset(transferParams).then(result => {
  if (isSuccess(result)) {
    // handle result transaction
  } else {
    // handle error
  }
});
```

### 5. Set the RPC URL

To configure the RPC URL, use the `setRpcUrl` with `SetRpcUrlRequestParams` as its parameters.

```typescript
import {setRpcUrl, SetRpcUrlRequestParams, isSuccess,} from 'azero-wallet-adapter';

const rpcParams: SetRpcUrlRequestParams = {rpcUrl: 'http://my-rpc-url'};

setRpcUrl(rpcParams).then((result) => {
  if (isSuccess(result)) {
    // execute callback after RPC URL is set
  } else {
    // handle error
  }
});
```
