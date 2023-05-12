import { requestSnap } from "./metamask";
import { PublicAccount } from "./types";
import { SignerPayloadJSON } from '@polkadot/types/types';

/**
 * Recreate an account from a seed, persist it, and return the account info.
 * @param seed The hex-encoded account seed bytes.
 * @returns Recovered account public info.
 */
export const getAccountFromSeed = async (seed: string): Promise<PublicAccount> => {
    return await requestSnap("getAccountFromSeed", [seed]);
}

/**
 * Create account from seed stored in metamask.
 * @returns Created account public info.
 */
export const generateNewAccount = async (): Promise<PublicAccount> => {
    return await requestSnap("generateNewAccount");
}

export const signTransaction = async (payload: SignerPayloadJSON): Promise<{ signature: string }> => {
    return await requestSnap("signTransaction", [payload as unknown as string]);
}

export const getAccounts = async (): Promise<string[]> => {
    return await requestSnap("getAccounts");
}
