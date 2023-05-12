import {RpcParams} from './types';
import {SNAP_ID} from './consts';

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
    params: { snapId: string; request: { method: string; params?: unknown[] | Record<string, unknown>; } },
): Promise<any> => {
    if (!window.ethereum || !window.ethereum.isMetaMask) {
        throw new Error('MetaMask is not installed');
    }
    console.log({method, params});
    const result = await window.ethereum.request({method, params});
    console.log({result});
    return result;
};

export async function requestSnap<T extends RpcParams, U>(
    method: T['method'],
    params?: T['params'],
): Promise<U> {
    return await request('wallet_invokeSnap', {
        snapId: SNAP_ID,
        request: {method, params},
    });
}

/**
 * Connect to snap. Attempts to install the snap if needed.
 * @throws If fails to connect
 */
export const connect = async () => {
    try {
        await window.ethereum.request({
            method: 'wallet_requestSnaps',
            params: {
                [SNAP_ID]: {},
            },
        });
    } catch (error) {
        // The `wallet_requestSnaps` call will throw if the requested permissions are rejected.
        if ((error as any).code === 4001) {
            console.error('The user rejected the request.');
            alert('The user rejected the request.');
        } else {
            console.error(error);
            alert('Error: ' + (error as any).message || error);
        }
        throw error;
    }
};
