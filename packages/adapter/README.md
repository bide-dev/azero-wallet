# `azero-wallet-adapter`

## Usage

```bash
pnpm add azero-wallet-adapter
```

## API

Follow the integration guide below for method usage and parameter handling.

(Note: For all methods, `params` is the data required by each method. It has
different types depending on the function being called.)

### 1. Get Account Address

The getAccount method doesn't need any parameters.

```typescript
async function fetchAccount() {
  const result: Result<GetAccountResult> = await getAccount();
  if (isSuccess(result)) {
    console.log(result.data); // {address: "account address"}
  } else {
    console.error(result.error);
  }
}
```

### 2. Sign and Send Payload

This method requires the `SignAndSendTransactionRequestParams` type for its
params. The response type is `Result<SignAndSendExtrinsicTransactionResult>`.
The payload includes the transaction (hex string) and payload (
SignerPayloadJSON type).

```typescript
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

Like the previous method, but only signs the payload without sending it. This
works with the `SignSignerPayloadRequestParams`.

```typescript
const signParams: SignSignerPayloadRequestParams = {payload: /*...*/};

signSignerPayload(signParams).then(result => {
  // handle result or error
});
```

### 4. Transfer Native Assets

This function requires the `TransferNativeAssetRequestParams` type for its
parameters.

```typescript
const transferParams: TransferNativeAssetRequestParams = {recipient: /*...*/, amount: /*...*/};

transferNativeAsset(transferParams).then(result => {
  // handle result or error
});
```

### 5. Set the RPC URL

To set the RPC URL, you can use the `setRpcUrl` with `SetRpcUrlRequestParams` as
its parameters.

```typescript
const rpcParams: SetRpcUrlRequestParams = { rpcUrl: 'http://my-rpc-url' };

setRpcUrl(rpcParams).then((result) => {
  if (isSuccess(result)) {
    // execute callback after RPC URL is set
  } else {
    // handle error
  }
});
```

## License

This project is licensed under the MIT License.
