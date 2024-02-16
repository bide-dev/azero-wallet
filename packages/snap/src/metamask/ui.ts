import type { Panel } from '@metamask/snaps-sdk';
import { divider, heading, panel, text } from '@metamask/snaps-sdk';
import type { AnyJson } from '@polkadot/types/types';

const capitalize = (s: string): string =>
  s.charAt(0).toUpperCase() + s.slice(1);

export const prettyJson = (record: Record<string, unknown>): string =>
  JSON.stringify(record, null, 2);

export const showConfirmationDialog = async (
  content: Panel,
): Promise<boolean> =>
  Boolean(
    // Eslint doesn't like the `await` here, but it's necessary
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await snap.request({
      method: 'snap_dialog',
      params: {
        type: 'confirmation',
        content,
      },
    }),
  );

const flattenObj = (
  obj: unknown,
  parentKeys: string[] = [],
): Record<string, unknown> => {
  if (!(obj instanceof Object)) {
    return { [parentKeys.join(' - ')]: obj };
  }

  return Object.entries(obj).reduce((result, [key, value]) => {
    const newKeys = [...parentKeys, capitalize(key)];
    return {
      ...result,
      ...(value instanceof Object
        ? flattenObj(value, newKeys)
        : { [newKeys.join(' - ')]: value }),
    };
  }, {});
};

const objectAsMarkdown = (obj: Record<string, unknown>) =>
  Object.entries(flattenObj(obj)).map(([key, value]) =>
    text({
      value: `**${key}**: ${prettyJson(value as Record<string, unknown>)}`,
      markdown: true,
    }),
  );

export const showConfirmTransactionDialog = async (
  signerPayload: AnyJson,
  signerAddress: string,
): Promise<boolean> => {
  const txRecords = objectAsMarkdown(signerPayload as Record<string, unknown>);
  const txPanel = panel({ children: txRecords });
  const confirmationPanel = panel([
    heading('Do you want to sign this transaction?'),
    divider(),
    heading(`Using account: ${signerAddress}`),
    txPanel,
  ]);
  return showConfirmationDialog(confirmationPanel);
};
