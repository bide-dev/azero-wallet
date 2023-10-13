import { AlephState } from 'azero-wallet-types';

export class SnapStorage {
  static async load(): Promise<AlephState> {
    return snap.request({
      method: 'snap_manageState',
      params: { operation: 'get' },
    }) as Promise<AlephState>;
  }

  static async save(state: AlephState): Promise<void> {
    await snap.request({
      method: 'snap_manageState',
      params: {
        operation: 'update',
        newState: state,
      },
    });
  }

  static async clear(): Promise<void> {
    await snap.request({
      method: 'snap_manageState',
      params: { operation: 'clear' },
    });
  }
}
