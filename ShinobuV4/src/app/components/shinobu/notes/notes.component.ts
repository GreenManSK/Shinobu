import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Note } from '../../../data/shinobu/Note';
import { NoteService } from '../../../services/data/shinobu/note.service';
import { LocalPreferenceService } from '../../../services/data/local-preference.service';
import { Color } from '../../../types/Color';
import { ShContextMenuClickEvent } from 'ng2-right-click-menu/lib/sh-context-menu.models';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit, OnDestroy {

  private static readonly ACTIVE_NOTE_KEY = 'activeNote';

  @ViewChild('contextMenuOwner') noteElement?: ElementRef;

  public notes: Note[] = [];
  public activeNote?: Note;

  public isTouch = false;

  private notesUnsubscribe?: () => void;

  constructor( private noteService: NoteService, private localPreferenceService: LocalPreferenceService, private deviceService: DeviceDetectorService ) {
  }

  ngOnInit(): void {
    this.isTouch = this.deviceService.isTablet() || this.deviceService.isMobile();
    this.noteService.onReady().then(() => this.prepareNotes());
  }

  ngOnDestroy(): void {
    this.notesUnsubscribe && this.notesUnsubscribe();
  }

  private prepareNotes() {
    this.notesUnsubscribe = this.noteService.getAll().subscribe(notes => {
      this.notes = notes;
      if (this.notes.length <= 0) {
        this.notes = [new Note('New note ' + Date.now())];
      }
      const activeNoteId = this.localPreferenceService.get(NotesComponent.ACTIVE_NOTE_KEY, 0);
      const activeNoteCandidate = this.notes.filter(note => note.id === activeNoteId);
      this.setActiveNote(activeNoteCandidate.length > 0 ? activeNoteCandidate[0] : this.notes[0]);
    }).unsubscribe;
  }

  public setActiveNote( note: Note ) {
    if (note.id) {
      this.localPreferenceService.set(NotesComponent.ACTIVE_NOTE_KEY, note.id);
    }
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

  public deleteNote( event: ShContextMenuClickEvent ) {
    const note = event.data as Note;
    if (confirm(`Do you really want to delete ${note.title}?`)) {
      this.noteService.delete(note);
    }
  }

  public openContextMenu() {
    if (!this.noteElement) {
      return;
    }
    const element = this.noteElement.nativeElement;
    const ev3 = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: false,
      view: window,
      button: 2,
      buttons: 0,
      clientX: element.getBoundingClientRect().x,
      clientY: element.getBoundingClientRect().y
    });
    element.dispatchEvent(ev3);
  }
}
