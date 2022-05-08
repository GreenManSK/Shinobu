import { Tile } from './Tile';
import { ASavable } from '../ASavable';

export class Tab extends ASavable {
  constructor(
    public title: string | null = null,
    public icon: string | null = null,
    public tiles: Tile[] = [],
    public order: number = 0
  ) {
    super();
  }
}
