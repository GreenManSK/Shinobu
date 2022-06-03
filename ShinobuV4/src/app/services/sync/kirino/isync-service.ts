import { ISyncable } from '../../../data/kirino/ISyncable';

export interface ISyncService<T extends ISyncable> {
  sync( item: T, force: boolean, log: boolean ): Promise<T>;

  syncAll(force: boolean, log: boolean): Promise<void>;

  isSynced(item: T): boolean;
}
