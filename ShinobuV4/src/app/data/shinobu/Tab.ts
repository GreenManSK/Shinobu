import { ISavable } from '../ISavable';
import { Tile } from './Tile';

export class Tab implements ISavable {
  public id?: number;

  constructor(
    public title: string,
    public icon: string,
    public tiles: Tile[],
    public order: number
  ) {
  }
}
