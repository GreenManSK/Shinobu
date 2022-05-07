import { Component, OnInit } from '@angular/core';
import { Note } from '../../../data/shinobu/Note';
import { NoteService } from '../../../services/data/shinobu/note.service';
import { LocalPreferenceService } from '../../../services/data/local-preference.service';
import { Color } from '../../../types/Color';
import { ShContextMenuClickEvent } from 'ng2-right-click-menu/lib/sh-context-menu.models';

@Component({
  selector: 'notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {

  private static readonly ACTIVE_NOTE_KEY = 'activeNote';

  public notes: Note[] = [];
  public activeNote?: Note;

  constructor( private noteService: NoteService, private localPreferenceService: LocalPreferenceService ) {
  }

  ngOnInit(): void {
    this.noteService.onReady().then(() => this.prepareNotes());
  }

  private prepareNotes() {
    this.noteService.getAll().subscribe(notes => {
      this.notes = notes;
      if (this.notes.length <= 0) {
        this.createNote();
        return;
      }
      const activeNoteId = this.localPreferenceService.get(NotesComponent.ACTIVE_NOTE_KEY, 0);
      const activeNoteCandidate = this.notes.filter(note => note.id === activeNoteId);
      this.setActiveNote(activeNoteCandidate.length > 0 ? activeNoteCandidate[0] : this.notes[0]);
    });
  }

  public setActiveNote( note: Note ) {
    this.localPreferenceService.save(NotesComponent.ACTIVE_NOTE_KEY, note.id);
    this.activeNote = note;
  }

  private createNote() {
    const note = new Note('New note ' + Date.now());
    return this.noteService.save(note);
  }

  public addNote() {
    this.createNote().then(note => this.setActiveNote(note));
  }

  public onColorChange( color: Color ) {
    if (!this.activeNote) {
      return;
    }
    this.activeNote.color = color;
    this.noteService.save(this.activeNote);
  }

  public deleteNote(event: ShContextMenuClickEvent) {
    const note = event.data as Note;
    if (confirm(`Do you really want to delete ${note.title}?`)) {
      this.noteService.delete(note);
    }
  }
}
