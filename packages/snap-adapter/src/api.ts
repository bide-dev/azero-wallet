import { requestSnap } from "./metamask";
import { PublicAccount } from "./types";
import { SignerPayloadJSON } from '@polkadot/types/types';
import {GenericExtrinsicPayload} from "@polkadot/types";

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

// export const signAndSendExtrinsicTransaction = async (payload: SignerPayloadJSON): Promise<{ signature: string }> => {
//     return await requestSnap("signAndSendExtrinsicTransaction", [payload as unknown as string]);
// }

export const signExtrinsicPayload = async (jsonPayload: string): Promise<{ signature: string }> => {
  return await requestSnap("signExtrinsicPayload", [jsonPayload]);
}


export const getAccounts = async (): Promise<string[]> => {
    return await requestSnap("getAccounts");
}
