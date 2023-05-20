/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { cryptoWaitReady } from '@polkadot/util-crypto';
import {
  construct,
  decode,
  deriveAddress,
  getRegistry,
  methods,
  PolkadotSS58Format,
  createMetadata,
  OptionsWithMeta,
} from '@substrate/txwrapper-polkadot';

import { KeyringPair } from '@polkadot/keyring/types';
import { EXTRINSIC_VERSION } from '@polkadot/types/extrinsic/v4/Extrinsic';
import { getApi, getKeyPair } from './utils';

const _importDynamic = new Function('modulePath', 'return import(modulePath)');

export const fetch = async function (...args: any) {
  const { default: fetch } = await _importDynamic('node-fetch');
  return fetch(...args);
};

export function rpcToLocalNode(
  method: string,
  params: any[] = [],
): Promise<any> {
  return fetch('http://localhost:9933', {
    body: JSON.stringify({
      id: 1,
      jsonrpc: '2.0',
      method,
      params,
    }),
    headers: {
      'Content-Type': 'application/json',
      connection: 'keep-alive',
    },
    method: 'POST',
  })
    .then((response: any) => response.json())
    .then(({ error, result }: { error: any; result: any }) => {
      if (error) {
        throw new Error(
          `${error.code} ${error.message}: ${JSON.stringify(error.data)}`,
        );
      }

      return result;
    });
}

export function signWith(
  pair: KeyringPair,
  signingPayload: string,
  options: OptionsWithMeta,
): `0x${string}` {
  const { registry, metadataRpc } = options;
  // Important! The registry needs to be updated with latest metadata, so make
  // sure to run `registry.setMetadata(metadata)` before signing.
  registry.setMetadata(createMetadata(registry, metadataRpc));

  const { signature } = registry
    .createType('ExtrinsicPayload', signingPayload, {
      version: EXTRINSIC_VERSION,
    })
    .sign(pair);

  return signature as unknown as `0x${string}`;
}

async function main(): Promise<void> {
  // Wait for the promise to resolve async WASM
  await cryptoWaitReady();
  // Create a new keyring, and add an "Alice" account
  const alice = getKeyPair();
  // Construct a balance transfer transaction offline.
  // To construct the tx, we need some up-to-date information from the node.
  // `txwrapper` is offline-only, so does not care how you retrieve this info.
  // In this tutorial, we simply send RPC requests to the node.
  const { block } = await rpcToLocalNode('chain_getBlock');
  const blockHash = await rpcToLocalNode('chain_getBlockHash');
  const genesisHash = await rpcToLocalNode('chain_getBlockHash', [0]);
  const metadataRpc = await rpcToLocalNode('state_getMetadata');
  const { specName, specVersion, transactionVersion } = await rpcToLocalNode(
    'state_getRuntimeVersion',
  );

  const registry = getRegistry({
    chainName: 'Aleph Zero Testnet',
    specName,
    specVersion,
    metadataRpc,
  });

  const api = await getApi();
  const nonce = (await api.derive.balances.account(alice.address)).accountNonce;

  const unsigned = methods.balances.transferKeepAlive(
    {
      value: '1',
      dest: { id: alice.address }, // Send to self
    },
    {
      address: deriveAddress(alice.publicKey, PolkadotSS58Format.polkadot),
      blockHash,
      blockNumber: registry
        .createType('BlockNumber', block.header.number)
        .toNumber(),
      eraPeriod: 64,
      genesisHash,
      metadataRpc,
      nonce: nonce.toNumber(),
      specVersion,
      tip: 0,
      transactionVersion,
    },
    {
      metadataRpc,
      registry,
    },
  );

  // Decode an unsigned transaction.
  const decodedUnsigned = decode(unsigned, {
    metadataRpc,
    registry,
  });
  console.log(
    `\nDecoded Transaction\n  To: ${
      (decodedUnsigned.method.args.dest as { id: string })?.id
    }\nAmount: ${decodedUnsigned.method.args.value}`,
  );

  // Construct the signing payload from an unsigned transaction.
  const signingPayload = construct.signingPayload(unsigned, { registry });
  console.log(`\nPayload to Sign: ${signingPayload}`);

  // Decode the information from a signing payload.
  const payloadInfo = decode(signingPayload, {
    metadataRpc,
    registry,
  });
  console.log(
    `\nDecoded Transaction\n  To: ${
      (payloadInfo.method.args.dest as { id: string })?.id
    }\nAmount: ${payloadInfo.method.args.value}`,
  );

  // Sign a payload. This operation should be performed on an offline device.
  const signature = signWith(alice, signingPayload, {
    metadataRpc,
    registry,
  });
  console.log(`\nSignature: ${signature}`);

  // Serialize a signed transaction.
  const tx = construct.signedTx(unsigned, signature, {
    metadataRpc,
    registry,
  });
  console.log(`\nTransaction to Submit: ${tx}`);

  // Derive the tx hash of a signed transaction offline.
  const expectedTxHash = construct.txHash(tx);
  console.log(`\nExpected Tx Hash: ${expectedTxHash}`);

  // Send the tx to the node. Again, since `txwrapper` is offline-only, this
  // operation should be handled externally. Here, we just send a JSONRPC
  // request directly to the node.
  const actualTxHash = await api.rpc.author.submitExtrinsic(tx);
  // const actualTxHash = await rpcToLocalNode('author_submitExtrinsic', [tx]);
  console.log(`Actual Tx Hash: ${actualTxHash}`);

  // Decode a signed payload.
  const txInfo = decode(tx, {
    metadataRpc,
    registry,
  });
  console.log(
    `\nDecoded Transaction\n  To: ${
      (txInfo.method.args.dest as { id: string })?.id
    }\nAmount: ${txInfo.method.args.value}\n`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
