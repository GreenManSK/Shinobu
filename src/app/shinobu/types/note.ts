import { Savable } from '../../types/savable';
import { NoteColor } from './note-color.enum';

export class Note implements Savable {

  public id: number;

  constructor(
    public title: string,
    public text: string = '',
    public color: NoteColor = NoteColor.Pink
  ) {
  }
}
