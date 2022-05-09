import { Injectable } from '@angular/core';
import { DynamicStorageService } from '../dynamic-storage.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../../auth.service';
import { ErrorService } from '../../error.service';
import { Manga } from '../../../data/kirino/Manga';

@Injectable({
  providedIn: 'root'
})
export class MangaService extends DynamicStorageService<Manga> {
  constructor( afs: AngularFirestore, authService: AuthService, errorService: ErrorService ) {
    super('manga', afs, authService, errorService);
  }
}
