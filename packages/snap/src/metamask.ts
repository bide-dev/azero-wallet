export const getBip44Entropy = async (coinType: number) =>
  snap.request({
    method: `snap_getBip44Entropy`,
    params: {
      coinType,
    },
  });
