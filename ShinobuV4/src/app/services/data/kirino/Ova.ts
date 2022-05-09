import { ASavable } from '../../../data/ASavable';

export class Ova extends ASavable {
  constructor(
    public title = '',
    public anidbId: number = 0,
    public airdate: number = 0
  ) {
    super();
  }
}
