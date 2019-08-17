import { Component, Input, OnInit } from '@angular/core';
import { Note } from '../../types/note';
import { NoteService } from '../../services/note.service';
import { NoteColor } from '../../types/note-color.enum';

@Component({
  selector: 'color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements OnInit {

  @Input()
  public note: Note;

  @Input()
  public noteService: NoteService;

  constructor() {
  }

  ngOnInit() {
  }

  public colorValues(): string[] {
    const names = [];
    for (const n in NoteColor) {
      if (typeof NoteColor[n] === 'number') {
        names.push(n);
      }
    }
    return names;
  }

  public changeColor( color: string ): void {
    this.note.color = NoteColor[color];
    this.noteService.save(this.note);
  }
}
