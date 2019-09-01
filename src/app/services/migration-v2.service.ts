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
import { Song } from '../modules/kirino/types/song';
import { Show } from '../modules/kirino/types/show';
import { Episode } from '../modules/kirino/types/episode';
import { Anime } from '../modules/kirino/types/anime';

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

  public doNeededMigration(): void {
    this.chromeStorageProvider.getSync().get((data) => {
      if (Object.keys(data).length <= 0) {
        this.migrateFromLocal();
      }
    });
  }

  public migrateFromLocal(): Promise<void> {
    return new Promise<object>(resolve => {
      this.chromeStorageProvider.getLocal().get(( data ) => {
        resolve(data);
      });
    }).then((data) => this.migrate(data));
  }

  public migrateFromString( json: string ): Promise<void> {
    return this.migrate(JSON.parse(json));
  }

  public migrate( data: object ): Promise<void> {
    if (Object.keys(data).length <= 0) {
      return Promise.resolve();
    }
    return this.clearAll()
      .then(() => this.migrateNotes(data))
      .then(() => this.migrateQuickAccess(data))
      .then(() => this.migrateOva(data))
      .then(() => this.migrateSongs(data))
      .then(() => this.migrateShows(data))
      .then(() => this.migrateAnime(data));
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
    const ids = data['Shinobu#tabs'].val.reverse();

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

  private async migrateSongs( data: object ): Promise<void> {
    const ids = data['Kirino#music'].val;
    for (const id of ids) {
      const song = new Song(
        data[id + '#show'].val,
        data[id + '#type'].val,
        data[id + '#title'].val,
        data[id + '#author'].val,
        data[id + '#date'].val,
        data[id + '#anidbId'].val,
        data[id + '#anisonId'].val,
      );
      await this.songService.save(song);
    }
    return Promise.resolve();
  }

  private async migrateShows( data: object ): Promise<void> {
    const ids = data['Kirino#show'].val;
    for (const id of ids) {
      const episodes = [];
      for (const epidoseId of data[id + '#episodes'].val) {
        episodes.push(new Episode(
          data[epidoseId + '#number'].val,
          data[epidoseId + '#date'].val
        ));
      }
      const show = new Show(
        data[id + '#name'].val,
        data[id + '#thetvdbId'].val,
        '',
        episodes,
      );
      await this.showServic.save(show);
    }
    return Promise.resolve();
  }

  private async migrateAnime( data: object ): Promise<void> {
    const ids = data['Kirino#anime'].val;
    for (const id of ids) {
      const episodes = [];
      for (const epidoseId of data[id + '#episodes'].val) {
        episodes.push(new Episode(
          data[epidoseId + '#number'].val,
          data[epidoseId + '#date'].val
        ));
      }
      const searchText = data[id + '#searchText'].val;
      const anime = new Anime(
        data[id + '#name'].val,
        data[id + '#anidbId'].val,
        searchText ? searchText.replace('%e', '%n') : null,
        episodes
      );
      await this.animeService.save(anime);
    }
    return Promise.resolve();
  }
}
