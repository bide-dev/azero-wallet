import * as azeroSnap from 'azero-snap-adapter';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { u8aToHex, hexToU8a } from '@polkadot/util';

import { defaultSnapOrigin } from '../config';
import { GetSnapsResponse, Snap } from '../types';

// TODO: Add to snap adapter
/**
 * Get the installed snaps in MetaMask.
 *
 * @returns The snaps installed in MetaMask.
 */
export const getSnaps = async (): Promise<GetSnapsResponse> => {
  return (await window.ethereum.request({
    method: 'wallet_getSnaps',
  })) as unknown as GetSnapsResponse;
};

/**
 * Connect a snap to MetaMask.
 *
 * @param snapId - The ID of the snap.
 * @param params - The params to pass with the snap to connect.
 */
export const connectSnap = async (
  snapId: string = defaultSnapOrigin,
  params: Record<'version' | string, unknown> = {},
) => {
  // await azeroSnap.connect(snapId, params);
  await azeroSnap.connect();
};

// TODO: Add to snap adapter
/**
 * Get the snap from MetaMask.
 *
 * @param version - The version of the snap to install (optional).
 * @returns The snap object returned by the extension.
 */
export const getSnap = async (version?: string): Promise<Snap | undefined> => {
  console.log('getSnap', version);
  try {
    const snaps = await getSnaps();
    console.log({ snaps });
    console.log({ defaultSnapOrigin });

    return Object.values(snaps).find(
      (snap) =>
        snap.id === defaultSnapOrigin && (!version || snap.version === version),
    );
  } catch (e) {
    console.log('Failed to obtain installed snap', e);
    return undefined;
  }
};

// TODO: Move some of that logic to the snap adapter?
export const sendTxTransferToSelf = async () => {
  const accounts = await azeroSnap.getAccounts();
  if (accounts.length === 0) {
    return;
  }
  const recipient = accounts[0];
  console.log({ recipient });

  const wsProvider = new WsProvider('wss://rpc.polkadot.io');
  const api = await ApiPromise.create({ provider: wsProvider });

  // Step 1: Create a transfer payload
  const transferValue = api.createType('Balance', 1e15); // 0.1
  const transferExt = api.tx.balances.transfer(recipient, transferValue);

  // Serialize the transfer payload
  const transferPayloadJson = JSON.stringify({
    payload: u8aToHex(transferExt.toU8a()),
  });

  // Step 2: Sign the transfer payload
  const { signatureJson } = await azeroSnap.signExtrinsicPayload(
    transferPayloadJson,
  );

  const deserializedSignature = JSON.parse(signatureJson).signature;
  const deserializedPayloadData = JSON.parse(payloadJson);
  const deserializedPayload = api.createType(
    'ExtrinsicPayload',
    hexToU8a(deserializedPayloadData.payload),
    { version: deserializedPayloadData.version },
  );

  // Step 3: Send the signed transfer transaction
  const extrinsic = api.tx.balances.transfer(recipient, transferValue);
  extrinsic.addSignature(
    recipient.address,
    hexToU8a(deserializedSignature),
    deserializedPayload,
  );

  const unsub = await extrinsic.send((result) => {
    console.log(`Transaction status: ${result.status}`);
    if (result.isInBlock || result.isFinalized) {
      console.log(`Block hash: ${result.status.asInBlock}`);
      unsub();
    }
  });
};

export const isLocalSnap = (snapId: string) => snapId.startsWith('local:');
