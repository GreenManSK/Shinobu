import {Savable} from '../../types/savable';

export class Ova implements Savable {
  constructor(
    public id: number,
    public title: string,
    public anidbId: number,
    public airdate: number
  ) {}
}
