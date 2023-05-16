const { readFileSync } = require('fs');
const { ApiPromise, WsProvider, HttpProvider } = require('@polkadot/api');
const { Keyring } = require('@polkadot/keyring');
const { u8aToHex, hexToU8a } = require('@polkadot/util');

function getKeyPair() {
  const json = readFileSync('./test-account.json', 'utf8');
  const jsonAccount = JSON.parse(json);
  const keyring = new Keyring({ type: 'sr25519' });
  const sender = keyring.addFromJson(jsonAccount);
  sender.unlock('alamakota1');
  return sender;
}

async function generateTransactionPayload(api, to, amount, senderAddress) {
  // fetch last signed block and account address
  const signedBlock = await api.rpc.chain.getBlock();
  // create signer options
  const nonce = (await api.derive.balances.account(senderAddress)).accountNonce;
  const signerOptions = {
    blockHash: signedBlock.block.header.hash,
    era: api.createType('ExtrinsicEra', {
      current: signedBlock.block.header.number,
      period: 50,
    }),
    nonce,
  };
  // define transaction method
  const transaction = api.tx.balances.transfer(to, amount);

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
    tx: transaction.toHex(),
  };
}

async function signPayloadJSON(api, payload) {
  const keyPair = await getKeyPair();
  // const confirmation = await showConfirmationDialog(
  //   snap,
  //   {
  //     description: `It will be signed with address: ${keyPair.address}`,
  //     prompt: `Do you want to sign this message?`,
  //     textAreaContent: messageCreator(
  //       [
  //         {message: 'address', value: payload.address},
  //         {message: 'tip', value: payload.tip},
  //         {message: 'block number', value: payload.blockNumber},
  //         {message: 'block hash', value: payload.blockHash},
  //         {message: 'genesis hash', value: payload.genesisHash},
  //         {message: 'era', value: payload.era},
  //         {message: 'nonce', value: payload.nonce},
  //         {message: 'spec version', value: payload.specVersion},
  //         {message: 'transaction version', value: payload.transactionVersion},
  //       ]
  //     )
  //   }
  // );
  // if (confirmation) {
  const extrinsic = api.registry.createType('ExtrinsicPayload', payload, {
    version: payload.version,
  });
  return extrinsic.sign(keyPair);
  // }
}

async function send(api, signature, txPayload) {
  const sender = getKeyPair().address;
  const destination = txPayload.payload.address;

  const extrinsic = api.createType('Extrinsic', txPayload.tx);
  extrinsic.addSignature(sender, signature, txPayload.payload);

  const amount = extrinsic.args[1].toJSON();
  const paymentInfo = await api.tx.balances
    .transfer(destination, Number(amount.toString()))
    .paymentInfo(sender);

  const txHash = await api.rpc.author.submitExtrinsic(extrinsic);

  const tx = {
    amount: amount,
    block: txHash.toHex(),
    destination: destination,
    fee: paymentInfo.partialFee.toJSON(),
    hash: extrinsic.hash.toHex(),
    sender: sender,
  };
  return tx;
}

const run = async () => {
  // Connect to the Polkadot node
  const wsProvider = new WsProvider('wss://ws.test.azero.dev/');
  const api = await ApiPromise.create({ provider: wsProvider });

  const sender = getKeyPair();

  const recipient = sender.address; // Sending to yourself
  const transferValue = api.createType('Balance', 1e15); // 0.1
  const txPayload = await generateTransactionPayload(
    api,
    recipient,
    transferValue,
    sender.address,
  );

  console.log({ txPayload });
  const signed = await signPayloadJSON(api, txPayload.payload);

  const tx = await send(api, signed.signature, txPayload);
  console.log({ tx });
};

run();
