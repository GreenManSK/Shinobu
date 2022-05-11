import { Injectable } from '@angular/core';
import { DynamicStorageService } from '../dynamic-storage.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../../auth.service';
import { ErrorService } from '../../error.service';
import { Anime } from '../../../data/kirino/Anime';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnimeService extends DynamicStorageService<Anime> {
  constructor( afs: AngularFirestore, authService: AuthService, errorService: ErrorService ) {
    super('anime', afs, authService, errorService);
  }

  override getById( id: string ): Observable<Anime> {
    return super.getById(id).pipe(map(anime => this.plainToAnime(anime)));
  }

  override getAll(): Observable<Anime[]> {
    return super.getAll().pipe(map(animes => animes.map(anime => this.plainToAnime(anime))));
  }

  private plainToAnime( plain: Anime ): Anime {
    const anime = new Anime();
    Object.assign(anime, plain);
    return anime;
  }
}
