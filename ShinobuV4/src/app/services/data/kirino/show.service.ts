import { Injectable } from '@angular/core';
import { DynamicStorageService } from '../dynamic-storage.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../../auth.service';
import { ErrorService } from '../../error.service';
import { Show } from '../../../data/kirino/Show';

@Injectable({
  providedIn: 'root'
})
export class ShowService extends DynamicStorageService<Show> {
  constructor( afs: AngularFirestore, authService: AuthService, errorService: ErrorService ) {
    super('shows', afs, authService, errorService);
  }
}
