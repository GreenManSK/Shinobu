import { ASyncable } from './ASyncable';

export class Ova extends ASyncable {
  constructor(
    public title = '',
    public anidbId: number = 0,
    public airdate: number = 0
  ) {
    super();
  }
}
