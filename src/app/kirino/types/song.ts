import {Savable} from '../../types/savable';

export class Song implements Savable {
  public id: number;

  constructor(
    public show: string,
    public type: string,
    public title: string,
    public author: string,
    public releaseDate: number,
    public anidbId: number,
    public anisonId: number
  ) {
  }
}
