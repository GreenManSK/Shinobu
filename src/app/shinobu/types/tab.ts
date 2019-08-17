import {Savable} from '../../types/savable';
import {Tile} from './tile';

export class Tab implements Savable {
  public id: number;

  constructor(
    public title: string,
    public icon: string,
    public tiles: Tile[] = []
  ) {
  }
}
