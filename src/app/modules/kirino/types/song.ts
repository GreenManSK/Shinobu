import { Savable } from '../../../types/savable';

export class Song implements Savable {
  public id: number;

  constructor(
    public show: string = null,
    public type: string = null,
    public title: string = null,
    public author: string = null,
    public releaseDate: number = null,
    public anidbId: number = null,
    public anisonId: number = null
  ) {
  }
}
