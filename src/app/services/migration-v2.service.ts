import { Injectable } from '@angular/core';
import { ChromeStorageProviderService } from './chrome-storage-provider.service';
import { NoteService } from '../modules/shinobu/services/note.service';
import { Note } from '../modules/shinobu/types/note';
import { NoteColor } from '../modules/shinobu/types/note-color.enum';
import { Tile } from '../modules/shinobu/types/tile';
import { TabService } from '../modules/shinobu/services/tab.service';
import { Tab } from '../modules/shinobu/types/tab';
import { OvaService } from '../modules/kirino/services/ova.service';
import { AnimeService } from '../modules/kirino/services/anime.service';
import { ShowService } from '../modules/kirino/services/show.service';
import { SongService } from '../modules/kirino/services/song.service';
import { Ova } from '../modules/kirino/types/ova';

@Injectable({
  providedIn: 'root'
})
export class MigrationV2Service {

  constructor(
    private chromeStorageProvider: ChromeStorageProviderService,
    private noteService: NoteService,
    private tabService: TabService,
    private ovaService: OvaService,
    private animeService: AnimeService,
    private showServic: ShowService,
    private songService: SongService
  ) {
  }

  public migrateFromLocal(): Promise<void> {
    return new Promise<object>(resolve => {
      this.chromeStorageProvider.getLocal().get(( data ) => {
        resolve(data);
      });
    }).then(this.migrate);
  }

  public migrateFromString( json: string ): Promise<void> {
    return this.migrate(JSON.parse(json));
  }

  public migrate( data: object ): Promise<void> {
    return this.clearAll()
      .then(() => this.migrateNotes(data))
      .then(() => this.migrateQuickAccess(data))
      .then(() => this.migrateOva(data));
  }

  private clearAll(): Promise<void> {
    const promises = [];
    promises.push(new Promise<void>(resolve => this.chromeStorageProvider.getLocal().clear(() => resolve())));
    promises.push(new Promise<void>(resolve => this.chromeStorageProvider.getSync().clear(() => resolve())));
    return new Promise<void>(resolve => Promise.all(promises).then(() => resolve()));
  }

  private firstUppercase( word: string ): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  private async migrateNotes( data: object ): Promise<void> {
    const ids = data['Shinobu#notes'].val;
    for (const id of ids) {
      const color = NoteColor[this.firstUppercase(data[id + '#color'].val)];
      const note = new Note(
        data[id + '#title'].val,
        data[id + '#text'].val,
        color ? color : NoteColor.Red
      );
      await this.noteService.save(note);
    }
    return Promise.resolve();
  }

  private async migrateQuickAccess( data: object ): Promise<void> {
    const ids = data['Shinobu#tabs'].val;

    for (const id of ids) {
      const tiles = [];

      for (const tileId of data[id + '#icons'].val) {
        const tile = new Tile(
          data[tileId + '#title'].val,
          data[tileId + '#link'].val,
          data[tileId + '#icon'].val,
        );
        tiles.push(tile);
      }

      const tab = new Tab(
        data[id + '#name'].val,
        data[id + '#icon'].val,
        tiles
      );
      await this.tabService.save(tab);
    }

    return Promise.resolve();
  }

  private async migrateOva( data: object ): Promise<void> {
    const ids = data['Kirino#ova'].val;
    for (const id of ids) {
      const ova = new Ova(
        data[id + '#name'].val,
        data[id + '#anidbEpisodeId'].val,
        data[id + '#date'].val,
      );
      await this.ovaService.save(ova);
    }
    return Promise.resolve();
  }
}
