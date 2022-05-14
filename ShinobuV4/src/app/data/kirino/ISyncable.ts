import { ISavable } from '../ISavable';

export interface ISyncable extends ISavable {
  lastSync?: number;
}
