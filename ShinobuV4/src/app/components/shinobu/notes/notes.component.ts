import { Component, OnInit } from '@angular/core';
import { Note } from '../../../data/shinobu/Note';

@Component({
  selector: 'notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {

  public activeNote = new Note("title", "text");

  constructor() { }

  ngOnInit(): void {
  }

}
