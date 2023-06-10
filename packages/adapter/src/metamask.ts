import { RpcParams } from './types';
import { SNAP_ID } from './consts';

declare global {
  interface Window {
    ethereum: {
      isMetaMask: boolean;
      request: (
        request: unknown | { method: string; params?: any[] },
      ) => Promise<any>;
    };
  }
}

const request = async (
  method: string,
  params: {
    snapId: string;
    request: { method: string; params?: unknown[] | Record<string, unknown> };
  },
): Promise<any> => {
  if (!window.ethereum || !window.ethereum.isMetaMask) {
    throw new Error('MetaMask is not installed');
  }
  console.log({ method, params });
  const result = await window.ethereum.request({ method, params });
  console.log({ result });
  return result;
};

export async function requestSnap<T extends RpcParams, U>(
  method: T['method'],
  params?: T['params'],
): Promise<U> {
  console.log({
    snapId: SNAP_ID,
    request: { method, params },
  });
  return await request('wallet_invokeSnap', {
    snapId: SNAP_ID,
    request: { method, params },
  });
}

/**
 * Connect to snap. Attempts to install the snap if needed.
 * @param snapId - The ID of the snap.
 * @param params - The params to pass with the snap to connect.
 * @returns
 * @throws If fails to connect to snap or install the snap.
 */
export const connect = async (
  snapId: string = SNAP_ID,
  params: Record<'version' | string, unknown> = {},
) => {
  try {
    await window.ethereum.request({
      method: 'wallet_requestSnaps',
      params: {
        [snapId]: params,
      },
    });
  } catch (error) {
    // The `wallet_requestSnaps` call will throw if the requested permissions are rejected.
    if ((error as any).code === 4001) {
      console.error('The user rejected the request.');
    } else {
      console.error(error);
    }
    throw error;
  }
};

/**
 * Detect if the wallet injecting the ethereum object is Flask.
 *
 * @returns True if the MetaMask version is Flask, false otherwise.
 */
export const isFlask = async () => {
  const provider = window.ethereum;

  try {
    const clientVersion = await provider?.request({
      method: 'web3_clientVersion',
    });

    const isFlaskDetected = (clientVersion as string[])?.includes('flask');

    return Boolean(provider && isFlaskDetected);
  } catch {
    return false;
  }
};
