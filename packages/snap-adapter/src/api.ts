import {requestSnap} from "./metamask";
import {SignerPayloadJSON} from "@polkadot/types/types";
import {TransactionInfo, TransactionPayload} from "./types";

// export const importAccountFromSeed = async (seed: string): Promise<PublicAccount> => {
//     return await requestSnap("importAccountFromSeed", [seed]);
// }

export const getAccounts = async (): Promise<string[]> => {
  return await requestSnap("getAccounts");
}

export const signAndSendTransactionPayload = async (payload: TransactionPayload): Promise<TransactionInfo> => {
    return await requestSnap("signAndSendTransactionPayload", [payload]);
}

export const signSignerPayloadJSON = async (): Promise<string> => {
  return await requestSnap("signSignerPayloadJSON");
}
