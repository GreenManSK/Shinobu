import { Component, Input, OnInit } from '@angular/core';
import { Note } from '../../types/note';
import { NoteColor } from "../../types/note-color.enum";
import { NoteService } from "../../services/note.service";

@Component({
  selector: 'note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit {

  private static readonly SAVE_PERIOD_MS = 1000;

  @Input()
  public note: Note;

  @Input()
  public noteService: NoteService;

  private saveTimeout: number;

  constructor() {
  }

  ngOnInit() {
  }

  public prepareSave(): void {
    clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => {
      this.noteService.save(this.note);
    }, NoteComponent.SAVE_PERIOD_MS);
  }

  public color(): string {
    return ('' + NoteColor[this.note.color]).toLocaleLowerCase();
  }
}
