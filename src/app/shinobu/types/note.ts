import {Savable} from '../../types/savable';
import {NoteColor} from './note-color.enum';

export class Note implements Savable {
  constructor(
    public id: number,
    public title: string,
    public text: string,
    public color: NoteColor
  ) {}
}
