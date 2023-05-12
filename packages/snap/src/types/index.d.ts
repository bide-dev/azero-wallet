import { JsonBIP44CoinTypeNode } from '@metamask/key-tree';

declare global {
  let snap: any;
}

// A convenient shorthand for a type.
export type Bip44Node = JsonBIP44CoinTypeNode;
