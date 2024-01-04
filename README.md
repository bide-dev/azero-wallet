# `azero-wallet`

This project implements a MetaMask snap that allows you to sign & send transaction on Aleph Zero network.

You can see a live demo of the snap [here](https://azero-snap.netlify.app/).

To learn more about how `azero-wallet` snap works and how to integrate the snap into your web app, see the [documentation](https://bide-dev.github.io/azero-wallet/).

To learn more about MetaMask snaps, see the [MetaMask snap documentation](https://docs.metamask.io/guide/snap.html).

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
