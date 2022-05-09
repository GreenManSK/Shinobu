import { Injectable } from '@angular/core';
import { DynamicStorageService } from '../dynamic-storage.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../../auth.service';
import { ErrorService } from '../../error.service';
import { Song } from '../../../data/kirino/Song';

@Injectable({
  providedIn: 'root'
})
export class SongService extends DynamicStorageService<Song> {
  constructor( afs: AngularFirestore, authService: AuthService, errorService: ErrorService ) {
    super('songs', afs, authService, errorService);
  }
}
