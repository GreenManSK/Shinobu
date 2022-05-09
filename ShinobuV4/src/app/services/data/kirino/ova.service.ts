import { Injectable } from '@angular/core';
import { DynamicStorageService } from '../dynamic-storage.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../../auth.service';
import { ErrorService } from '../../error.service';
import { Ova } from '../../../data/kirino/Ova';

@Injectable({
  providedIn: 'root'
})
export class OvaService extends DynamicStorageService<Ova> {
  constructor( afs: AngularFirestore, authService: AuthService, errorService: ErrorService ) {
    super('ovas', afs, authService, errorService);
  }
}
