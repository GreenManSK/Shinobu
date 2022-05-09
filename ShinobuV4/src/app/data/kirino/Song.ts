import { ASavable } from '../ASavable';


export class Song extends ASavable {

  constructor(
    public show: string = '',
    public type: string = '',
    public title: string = '',
    public author: string = '',
    public releaseDate: number = 0,
    public anidbId: number = 0,
    public anisonId: number = 0
  ) {
    super();
  }
}
