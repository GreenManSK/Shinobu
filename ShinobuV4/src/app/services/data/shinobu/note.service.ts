import { DynamicStorageService } from '../dynamic-storage.service';
import { Note } from '../../../data/shinobu/Note';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../../auth.service';
import { ErrorService } from '../../error.service';

@Injectable({
  providedIn: 'root'
})
export class NoteService extends DynamicStorageService<Note> {
  constructor( afs: AngularFirestore, authService: AuthService, errorService: ErrorService ) {
    super('notes', afs, authService, errorService);
  }
}
