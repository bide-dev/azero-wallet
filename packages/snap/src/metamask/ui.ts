import { divider, heading, Panel, panel, text } from '@metamask/snaps-ui';
import { SignerPayloadJSON } from '@polkadot/types/types';

export const stringify = (record: Record<string, unknown>): string =>
  JSON.stringify(record, null, 2);

export const showConfirmationDialog = async (
  content: Panel,
): Promise<boolean> =>
  // Eslint doesn't like the `await` here, but it's necessary
  // eslint-disable-next-line @typescript-eslint/await-thenable
  (await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content,
    },
  })) as boolean;

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
