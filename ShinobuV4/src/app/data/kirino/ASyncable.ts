import { ASavable } from '../ASavable';

export abstract class ASyncable extends ASavable {
  public lastSync?: number;
}
