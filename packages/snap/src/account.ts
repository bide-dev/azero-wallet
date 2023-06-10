import { JsonBIP44CoinTypeNode } from '@metamask/key-tree';
import { ApiPromise, Keyring } from '@polkadot/api';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { KeyringPair } from '@polkadot/keyring/types';
import { SignerPayloadJSON } from '@polkadot/types/types';
import { hexToU8a, stringToU8a, u8aToHex } from '@polkadot/util';
import { HexString } from '@polkadot/util/types';
import { TransactionInfo, TransactionPayload } from 'azero-wallet-adapter';
import { SnapState } from 'state';

import { getBip44Entropy } from './metamask/bip';
import { showConfirmTransactionDialog } from './metamask/ui';
import { PolkadotAPI } from './polkadot-api';

export type PrivateAccount = {
  seed: string;
} & PublicAccount;

export type PublicAccount = {
  address: string;
  publicKey: string;
};

export class KeyPairFactory {
  static SS58FORMAT = 42; // default

  static COIN_TYPE = 434; // kusama

  static fromSeed(seed: Uint8Array): KeyringPair {
    const keyring = new Keyring({
      ss58Format: KeyPairFactory.SS58FORMAT,
      type: 'sr25519',
    });
    return keyring.addFromSeed(seed);
  }
}

export const persistAccount = async (
  pair: PrivateAccount,
  state: SnapState,
) => {
  const newWalletState = state.wallet.importAccount(pair);
  await state.setState(newWalletState);
};

export const recoverAccount = async (
  state: SnapState,
  seed: string,
): Promise<PublicAccount> => {
  const pair = KeyPairFactory.fromSeed(hexToU8a(seed));

  const publicAccount: PublicAccount = {
    address: pair.address,
    publicKey: u8aToHex(pair.publicKey),
  };

  await persistAccount({ ...publicAccount, seed }, state);

  return publicAccount;
};

export const generateKeyringFromBip44Entropy =
  async (): Promise<KeyringPair> => {
    const entropy: JsonBIP44CoinTypeNode = await getBip44Entropy(
      KeyPairFactory.COIN_TYPE,
    );
    const seed = entropy.privateKey.slice(0, 32);
    const binSeed = stringToU8a(seed);
    // const mnemonic = bip39.entropyToMnemonic(u8aToHex(binSeed));
    // console.log('mnemonic', mnemonic);
    return KeyPairFactory.fromSeed(binSeed);
  };

export const getDefaultKeyringPair = async (): Promise<KeyringPair> => {
  const keyring = await generateKeyringFromBip44Entropy();
  console.log('keyring.address', keyring.address);
  return keyring;
};

/**
 *
 * @param api
 * @param from
 * @param to
 * @param amount
 */
export async function generateTransactionPayload(
  api: ApiPromise,
  from: string,
  to: string,
  amount: string | number,
): Promise<TransactionPayload> {
  const signedBlock = await api.rpc.chain.getBlock();

  const account = await api.derive.balances.account(from);
  const nonce = account.accountNonce;
  const signerOptions = {
    blockHash: signedBlock.block.header.hash,
    era: api.createType('ExtrinsicEra', {
      current: signedBlock.block.header.number,
      period: 50,
    }),
    nonce,
  };
  // define transaction method
  const transaction: SubmittableExtrinsic<'promise'> = api.tx.balances.transfer(
    to,
    amount,
  );

  // create SignerPayload
  const signerPayload = api.createType('SignerPayload', {
    genesisHash: api.genesisHash,
    runtimeVersion: api.runtimeVersion,
    version: api.extrinsicVersion,
    ...signerOptions,
    address: to,
    blockNumber: signedBlock.block.header.number,
    method: transaction.method,
    signedExtensions: [],
    transactionVersion: transaction.version,
  });

  return {
    payload: signerPayload.toPayload(),
    transaction: transaction.toHex(),
  };
}

export const signAndSendExtrinsicTransaction = async (
  api: PolkadotAPI,
  txPayload: TransactionPayload,
): Promise<TransactionInfo | void> => {
  const signed = await signSignerPayloadJSON(api, txPayload.payload);
  if (!signed) {
    return;
  }
  return await api.sendTransactionWithSignature(txPayload, signed);
};

/**
 *
 * @param api
 * @param signerPayload
 * @param showConfirmDialog
 */
export async function signSignerPayloadJSON(
  api: PolkadotAPI,
  signerPayload: SignerPayloadJSON,
  showConfirmDialog = true,
): Promise<HexString | void> {
  const keyPair = await getDefaultKeyringPair();

  const confirmation = showConfirmDialog
    ? await showConfirmTransactionDialog(signerPayload, keyPair.address)
    : false;

  if (confirmation) {
    const extrinsic = api.inner.registry.createType(
      'ExtrinsicPayload',
      signerPayload,
      {
        version: signerPayload.version,
      },
    );
    const { signature } = extrinsic.sign(keyPair);
    return signature;
  }
}
