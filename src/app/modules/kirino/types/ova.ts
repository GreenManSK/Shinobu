import {Savable} from '../../../types/savable';

export class Ova implements Savable {
  public id: number;

  constructor(
    public title: string = null,
    public anidbId: number = null,
    public airdate: number = null
  ) {
  }
}
