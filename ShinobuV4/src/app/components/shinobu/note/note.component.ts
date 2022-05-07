import { Component, Input, OnInit } from '@angular/core';
import { Note } from '../../../data/shinobu/Note';
import { Color } from '../../../types/Color';

@Component({
  selector: 'note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit {

  @Input()
  public note?: Note;

  constructor() { }

  ngOnInit(): void {
  }

  public prepareSave() {
    // TODO
  }

  public color(): string {
    if (!this.note) {
      return "";
    }
    return ('' + Color[this.note.color]).toLocaleLowerCase();
  }
}
