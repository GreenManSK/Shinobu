import { Injectable } from '@angular/core';
import { DynamicStorageService } from '../dynamic-storage.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../../auth.service';
import { ErrorService } from '../../error.service';
import { Anime } from '../../../data/kirino/Anime';

@Injectable({
  providedIn: 'root'
})
export class AnimeService extends DynamicStorageService<Anime> {
  constructor( afs: AngularFirestore, authService: AuthService, errorService: ErrorService ) {
    super('anime', afs, authService, errorService);
  }
}
