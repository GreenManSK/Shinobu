import { Tile } from './Tile';
import { ASavable } from '../ASavable';

export class Tab extends ASavable {
  constructor(
    public title: string,
    public icon: string,
    public tiles: Tile[],
    public order: number
  ) {
    super();
  }
}
