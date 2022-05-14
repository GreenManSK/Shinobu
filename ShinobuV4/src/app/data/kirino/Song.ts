import { ASyncable } from './ASyncable';


export class Song extends ASyncable {

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
