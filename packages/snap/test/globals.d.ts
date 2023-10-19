import { SnapsGlobalObject } from '@metamask/snaps-types';
import { SnapMock } from './helpers/snapMock';

declare global {
  namespace NodeJS {
    interface Global {
      snap: SnapsGlobalObject & SnapMock;
    }
  }
}
