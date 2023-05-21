import { ApiPromise, HttpProvider, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { readFileSync } from 'fs';

export const getKeyPair = () => {
  const json = readFileSync('./test-account.json', 'utf8');
  const jsonAccount = JSON.parse(json);
  const keyring = new Keyring({ type: 'sr25519' });
  const sender = keyring.addFromJson(jsonAccount);
  sender.unlock('alamakota1');
  return sender;
};

export const getApi = async () => {
  // const provider = new WsProvider('wss://ws.test.azero.dev/');
  // const provider = new HttpProvider('http://18.224.252.107:9933');
  const provider = new HttpProvider('http://localhost:9933');
  return ApiPromise.create({ provider });
};
