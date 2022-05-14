import { Injectable } from '@angular/core';
import { DynamicStorageService } from '../dynamic-storage.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../../auth.service';
import { ErrorService } from '../../error.service';
import { Manga } from '../../../data/kirino/Manga';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MangaService extends DynamicStorageService<Manga> {
  constructor( afs: AngularFirestore, authService: AuthService, errorService: ErrorService ) {
    super('manga', afs, authService, errorService);
  }

  override getById( id: string ): Observable<Manga> {
    return super.getById(id).pipe(map(manga => this.plainToManga(manga)));
  }

  override getAll(): Observable<Manga[]> {
    return super.getAll().pipe(map(mangas => mangas.map(manga => this.plainToManga(manga))));
  }

  private plainToManga( plain: Manga ): Manga {
    const manga = new Manga();
    Object.assign(manga, plain);
    return manga;
  }
}
