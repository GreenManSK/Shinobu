import { Component, OnInit } from '@angular/core';
import { ChromeMockStorageService } from '../../../mocks/chrome-mock-storage.service';
import { NoteService } from '../../services/note.service';
import { Note } from '../../types/note';
import { LocalPreferenceService } from '../../../services/local-preference.service';

@Component({
  selector: 'notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {

  private static readonly ACTIVE_NOTE_KEY = 'activeNote';

  public noteService: NoteService;
  public notes: Note[];
  public activeNote: Note;

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
        this.activeNote = this.notes.filter((n) => n.id === activeNoteKey)[0];
        if (!this.activeNote) {
          this.activeNote = this.notes[0];
        }
    });
  }

  public addNote(): void {
    this.createNote().then((note) => this.activeNote = note);
  }

  public changeActiveNote(note: Note): void {
    this.activeNote = note;
    this.localPreference.get(NotesComponent.ACTIVE_NOTE_KEY, note.id);
  }

  public deleteActiveNote(): void {
    if (this.notes.length <= 1) {
      return;
    }
    const note = this.activeNote;
    this.noteService.delete(note).then(() => {
      const index = this.notes.indexOf(note, 0);
      if (index > -1) {
        this.notes.splice(index, 1);
      }
      this.changeActiveNote(this.notes[0]);
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
