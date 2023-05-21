import { SignerPayloadJSON } from '@polkadot/types/types';
import { divider, heading, Panel, panel, text } from '@metamask/snaps-ui';

export const stringify = (record: Record<string, unknown>): string =>
  JSON.stringify(record, null, 2);

export type ConfirmationDialog = {
  heading: string;
  text: string;
};

export const showConfirmationDialog = async (
  content: Panel,
): Promise<boolean> => {
  return (await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content,
    },
  })) as boolean;
};

export const showConfirmTransactionDialog = async (
  signerPayload: SignerPayloadJSON,
  signerAddress: string,
) => {
  const tx: Record<string, unknown> = { ...signerPayload };
  const confirmationPanel = panel([
    heading('Do you want to sign this transaction?'),
    divider(),
    heading(`Using account: ${signerAddress}`),
    text(stringify(tx)),
  ]);
  return showConfirmationDialog(confirmationPanel);
};
