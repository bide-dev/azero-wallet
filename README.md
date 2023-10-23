# `azero-wallet`

This project implements a MetaMask snap that allows you to sign & send transaction on Aleph Zero network.

To learn more about snaps, see the [MetaMask snap documentation](https://docs.metamask.io/guide/snap.html).

## Overview

Normally, you would use [`azero-wallet-adapter`](packages/adapter) to connect to the [`azero-wallet`](packages/snap)
snap.

See [an integration example](../../examples/site) to learn how to integrate `azero-wallet` into a web app
using `azero-wallet-adapter`.

## Development

```bash
pnpm install
pnpm build
pnpm test
```
