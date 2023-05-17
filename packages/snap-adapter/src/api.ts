import { requestSnap } from "./metamask";

// /**
//  * Recreate an account from a seed, persist it, and return the account info.
//  * @param seed The hex-encoded account seed bytes.
//  * @returns Recovered account public info.
//  */
// export const importAccountFromSeed = async (seed: string): Promise<PublicAccount> => {
//     return await requestSnap("importAccountFromSeed", [seed]);
// }


// export const signAndSendExtrinsicTransaction = async (payload: SignerPayloadJSON): Promise<{ signature: string }> => {
//     return await requestSnap("signAndSendExtrinsicTransaction", [payload as unknown as string]);
// }

// export const signExtrinsicPayload = async (jsonPayload: string): Promise<{ signature: string }> => {
//   return await requestSnap("signExtrinsicPayload", [jsonPayload]);
// }


export const getAccounts = async (): Promise<string[]> => {
    return await requestSnap("getAccounts");
}
