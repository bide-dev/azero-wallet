import {readFileSync} from "fs";
import {Keyring} from "@polkadot/keyring";
import {ApiPromise, WsProvider} from "@polkadot/api";

export const getKeyPair = () => {
  const json = readFileSync('./test-account.json', 'utf8');
  const jsonAccount = JSON.parse(json);
  const keyring = new Keyring({ type: 'sr25519' });
  const sender = keyring.addFromJson(jsonAccount);
  sender.unlock('alamakota1');
  return sender;
};

export const getApi = async () => {
  const wsProvider = new WsProvider('wss://ws.test.azero.dev/');
  return ApiPromise.create({ provider: wsProvider });
};
