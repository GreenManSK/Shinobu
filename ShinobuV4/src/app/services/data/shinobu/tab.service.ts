import { Tab } from '../../../data/shinobu/Tab';
import { Injectable } from '@angular/core';
import { DynamicStorageService } from '../dynamic-storage.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../../auth.service';
import { ErrorService } from '../../error.service';

@Injectable({
  providedIn: 'root'
})
export class TabService extends DynamicStorageService<Tab> {
  constructor(afs: AngularFirestore, authService: AuthService, errorService: ErrorService ) {
    super("tabs", afs, authService, errorService);
  }
}
