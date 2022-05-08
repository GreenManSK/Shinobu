import { ISavable } from './ISavable';

export abstract class ASavable implements ISavable {
  public id?: string;
  public userId?: string;
}
