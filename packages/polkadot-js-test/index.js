const { ApiPromise, WsProvider, HttpProvider } = require('@polkadot/api');
const { Keyring } = require('@polkadot/keyring');
const { u8aToHex, hexToU8a } = require('@polkadot/util');
const { readFileSync } = require('fs');

const run = async () => {
  // Connect to the Polkadot node
  const wsProvider = new WsProvider('wss://ws.test.azero.dev/');
  const api = await ApiPromise.create({ provider: wsProvider });

  // const provider = new HttpProvider('https://test.azero.dev/');
  // this.inner = await ApiPromise.create({ provider });

  // Initialize the keyring
  const json = readFileSync('./test-account.json', 'utf8');
  const jsonAccount = JSON.parse(json);
  const keyring = new Keyring({ type: 'sr25519' });
  const sender = keyring.addFromJson(jsonAccount);
  sender.unlock('alamakota1');

  // Step 1: Create a transfer payload
  const recipient = sender.address; // Sending to yourself
  const transferValue = api.createType('Balance', 1e15); // 0.1 DOT

  const transfer = api.tx.balances.transfer(recipient, transferValue);

  // Serialize the transfer payload
  const transferPayloadJson = JSON.stringify({
    payload: u8aToHex(transfer.toU8a()),
    version: transfer.version,
  });

  // Simulate the transfer of the JSON string (deserialize from JSON)
  const deserializedPayloadData = JSON.parse(transferPayloadJson);
  const deserializedPayload = api.createType(
    'ExtrinsicPayload',
    hexToU8a(deserializedPayloadData.payload),
    { version: deserializedPayloadData.version },
  );

  // Step 2: Sign the transfer payload
  const { signature } = transfer.sign(deserializedPayload, {
    signer: sender,
  });

  // Serialize the signature and payload variables
  const signatureJson = JSON.stringify({ signature: u8aToHex(signature) });

  // Simulate the transfer of the JSON string (deserialize from JSON)
  const deserializedSignature = JSON.parse(signatureJson).signature;

  // Step 3: Send the signed transfer transaction
  const extrinsic = api.tx.balances.transfer(recipient, transferValue);
  extrinsic.addSignature(
    sender.address,
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

run();
