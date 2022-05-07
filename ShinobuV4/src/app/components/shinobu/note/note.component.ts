import { Component, Input, OnInit } from '@angular/core';
import { Note } from '../../../data/shinobu/Note';
import { Color } from '../../../types/Color';
import { NoteService } from '../../../services/data/shinobu/note.service';

@Component({
  selector: 'note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit {

  private static readonly SAVE_PERIOD_MS = 1000;

  @Input()
  public note?: Note;

  private saveTimeout?: number;

  constructor( private noteService: NoteService ) {
  }

  ngOnInit(): void {
  }

  public prepareSave() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    this.saveTimeout = setTimeout(() => {
      if (this.note) {
        this.noteService.save(this.note);
      }
    }, NoteComponent.SAVE_PERIOD_MS);
  }

  public color(): string {
    if (!this.note) {
      return '';
    }
    return ('' + Color[this.note.color]).toLocaleLowerCase();
  }
}
