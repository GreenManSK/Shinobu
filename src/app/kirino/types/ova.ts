import {Savable} from '../../types/savable';

export class Ova implements Savable {
  public id: number;

  constructor(
    public title: string,
    public anidbId: number,
    public airdate: number
  ) {
  }
}
