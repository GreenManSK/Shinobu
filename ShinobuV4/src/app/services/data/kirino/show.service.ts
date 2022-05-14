import { Injectable } from '@angular/core';
import { DynamicStorageService } from '../dynamic-storage.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../../auth.service';
import { ErrorService } from '../../error.service';
import { Show } from '../../../data/kirino/Show';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShowService extends DynamicStorageService<Show> {
  constructor( afs: AngularFirestore, authService: AuthService, errorService: ErrorService ) {
    super('shows', afs, authService, errorService);
  }

  override getById( id: string ): Observable<Show> {
    return super.getById(id).pipe(map(show => this.plainToShow(show)));
  }

  override getAll(): Observable<Show[]> {
    return super.getAll().pipe(map(shows => shows.map(show => this.plainToShow(show))));
  }

  private plainToShow( plain: Show ): Show {
    const show = new Show();
    Object.assign(show, plain);
    return show;
  }
}
