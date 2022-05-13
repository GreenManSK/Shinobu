import { Injectable } from '@angular/core';
import { DynamicStorageService } from '../dynamic-storage.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../../auth.service';
import { ErrorService } from '../../error.service';
import { Song } from '../../../data/kirino/Song';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SongService extends DynamicStorageService<Song> {
  constructor( afs: AngularFirestore, authService: AuthService, errorService: ErrorService ) {
    super('songs', afs, authService, errorService);
  }

  override getById( id: string ): Observable<Song> {
    return super.getById(id).pipe(map(song => this.plainToSong(song)));
  }

  override getAll(): Observable<Song[]> {
    return super.getAll().pipe(map(songs => songs.map(song => this.plainToSong(song))));
  }

  private plainToSong(plain: Song): Song {
    const song = new Song();
    Object.assign(song, plain);
    return song;
  }
}
