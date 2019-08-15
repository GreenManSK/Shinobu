import {Savable} from '../../types/savable';
import {Tile} from './tile';

export class Tab implements Savable {
  constructor(
    public id: number,
    public title: string,
    public icon: string,
    public tiles: Tile[]
  ) {
  }
}
