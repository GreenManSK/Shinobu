import { Component, OnInit } from '@angular/core';
import { ChromeMockStorageService } from '../../../mocks/chrome-mock-storage.service';
import { NoteService } from '../../services/note.service';
import { Note } from '../../types/note';
import { LocalPreferenceService } from "../../../services/local-preference.service";

@Component({
  selector: 'notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {

  private static readonly ACTIVE_NOTE_KEY = 'activeNote';

  private noteService: NoteService;
  private notes: Note[];
  private activeNote: Note;

  constructor(
    public localPreference: LocalPreferenceService,
    chromeStorage: ChromeMockStorageService
  ) {
    this.noteService = new NoteService(chromeStorage);
  }

  ngOnInit() {
    this.noteService.getAll().then(( notes ) => {
      this.notes = notes as Note[];
      if (!this.notes || this.notes.length <= 0) {
        return this.createNote();
      }
      return Promise.resolve(this.notes[0]);
    }).then(() => {
      this.notes.sort(( a, b ) => a.title.localeCompare(b.title));
      return this.localPreference.get(NotesComponent.ACTIVE_NOTE_KEY, 0);
    }).then((activeNoteKey) => {
      if (activeNoteKey >= this.notes.length) {
        this.activeNote = this.notes[0];
      } else {
        this.activeNote = this.notes[activeNoteKey];
      }
    });
  }

  private createNote(): Promise<Note> {
    const note = new Note('New note ' + Date.now());
    return this.noteService.save(note).then(() => {
      this.notes.push(note);
      return note;
    });
  }
}
