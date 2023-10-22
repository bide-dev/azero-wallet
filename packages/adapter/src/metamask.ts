import { RequestArguments } from '@metamask/providers/dist/BaseProvider';
import { AlephRPCRequest, Result } from 'azero-wallet-types';
import { getSnapId } from './consts';

const walletRequest = async (requestArgs: RequestArguments): Promise<any> => {
  if (!window.ethereum?.isMetaMask) {
    throw new Error('MetaMask is not available');
  }
  return window.ethereum.request(requestArgs);
};

/**
 * Send a AlephRPCRequest to snap.
 *
 * @param request - The `AlephRPCRequest` request to send.
 * @returns The result of the request.
 * @throws If fails to send the request.
 */
export async function sendSnapMethod<T>(
  request: AlephRPCRequest,
): Promise<Result<T>> {
  return walletRequest({
    method: 'wallet_invokeSnap',
    params: {
      snapId: getSnapId(),
      request,
    },
  });
}

/**
 * Connect to snap. Attempts to install the snap if needed.
 *
 * @param snapId - The ID of the snap.
 * @param params - The params to pass with the snap to connect.
 * @throws If fails to connect to snap or install the snap.
 */
export const connect = async (
  snapId: string = getSnapId(),
  params: Record<'version' | string, unknown> = {},
): Promise<void> => {
  await walletRequest({
    method: 'wallet_requestSnaps',
    params: {
      [snapId]: params,
    },
  });
};

/**
 * Detect if the wallet injecting the ethereum object is Flask.
 *
 * @returns True if the MetaMask version is Flask, false otherwise.
 */
export const isFlask = async (): Promise<boolean> => {
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

/**
 * Detect if the snap is installed.
 *
 * @returns True if the snap is installed, false otherwise.
 */
export const isInstalled = async (): Promise<boolean> => {
  try {
    const result = await walletRequest({
      method: 'wallet_requestSnaps',
      params: {
        [getSnapId()]: {},
      },
    });
    return Boolean(result);
  } catch (error) {
    return false;
  }
};
