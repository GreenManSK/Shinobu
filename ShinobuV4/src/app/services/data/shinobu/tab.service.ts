import { Tab } from '../../../data/shinobu/Tab';
import { Injectable } from '@angular/core';
import { DynamicStorageService } from '../dynamic-storage.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../../auth.service';
import { ErrorService } from '../../error.service';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TabService extends DynamicStorageService<Tab> {
  constructor(afs: AngularFirestore, authService: AuthService, errorService: ErrorService ) {
    super("tabs", afs, authService, errorService);
  }

  override getAll(): Observable<Tab[]> {
    return super.getAll().pipe(map(tabs => tabs.map(this.sortTiles)));
  }

  override getById( id: string ): Observable<Tab> {
    return super.getById(id).pipe(map(tab => this.sortTiles(tab)));
  }

  private sortTiles(tab: Tab): Tab {
    tab.tiles?.sort((a,b) => a.order - b.order);
    return tab;
  }
}
