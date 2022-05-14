/// <reference types="chrome" />
import { Injectable } from '@angular/core';
import { TabService } from '../data/shinobu/tab.service';
import { Tab } from '../../data/shinobu/Tab';
import { Tile } from '../../data/shinobu/Tile';
import { NoteService } from '../data/shinobu/note.service';
import { Note } from '../../data/shinobu/Note';
import { Anime } from '../../data/kirino/Anime';
import { AnimeService } from '../data/kirino/anime.service';
import { NyaaSearch } from '../../data/kirino/NyaaSearch';
import { Episode } from '../../data/kirino/Episode';
import { SongService } from '../data/kirino/song.service';
import { Song } from '../../data/kirino/Song';
import { OvaService } from '../data/kirino/ova.service';
import { Ova } from '../../data/kirino/Ova';
import { ShowService } from '../data/kirino/show.service';
import { Show } from '../../data/kirino/Show';
import { MangaService } from '../data/kirino/manga.service';
import { Manga } from '../../data/kirino/Manga';

type ChromeStorageData = { [key: string]: any };

@Injectable({
  providedIn: 'root'
})
export class MigrationService {

  private static readonly MIGRATED_FLAG = 'SHINOBU_V4_MIGRATED';
  private static readonly MIGRATE_FIELDS = ['Note', 'Tab'];

  constructor(
    private tabService: TabService,
    private noteService: NoteService,
    private animeService: AnimeService,
    private songService: SongService,
    private ovaService: OvaService,
    private showService: ShowService,
    private mangaService: MangaService
  ) {
  }

  public migrate(): Promise<void> {
    if (!chrome && !chrome.storage && !chrome.storage.sync) {
      return Promise.reject();
    }
    return new Promise<void>(resolve => chrome.storage.sync.get(data => {
      this.migrateTabs(data)
        .then(() => this.migrateNotes(data))
        .then(() => this.migrateAnime(data))
        .then(() => this.migrateMusic(data))
        .then(() => this.migrateOva(data))
        .then(() => this.migrateShows(data))
        .then(() => this.migrateManga(data))
        .then(() => resolve());
    }));
  }

  public hasDataToMigrate() {
    return new Promise<boolean>(resolve => {
      chrome && chrome.storage && chrome.storage.sync && chrome.storage.sync.get([...MigrationService.MIGRATE_FIELDS, MigrationService.MIGRATED_FLAG], ( result ) => {
        const migrated = !!result[MigrationService.MIGRATED_FLAG];
        const dataToMigrated = MigrationService.MIGRATE_FIELDS.map(key => result[key]).filter(data => Array.isArray(data) && data.length > 0).length > 0;
        resolve(dataToMigrated && !migrated);
      });
    })
  }

  public markAsMigrated() {
    chrome.storage.sync.set({
      [`${MigrationService.MIGRATED_FLAG}`]: true
    });
  }

  private migrateTabs( data: ChromeStorageData ): Promise<void> {
    if (!data['Tab']) {
      return Promise.resolve();
    }
    const promises: Promise<any>[] = [];
    let order = 1;
    data['Tab'].forEach(( tabId: string ) => {
      const chromeTab = data[tabId];
      if (!chromeTab) {
        return;
      }
      let tileOrder = 1;
      const tiles = chromeTab.tiles ? chromeTab.tiles.map(( chromeTile: any ) => new Tile(
        chromeTile.title,
        chromeTile.link,
        chromeTile.icon,
        tileOrder++
      )) : [];
      const tab = new Tab(chromeTab.title, chromeTab.icon, tiles, order++);
      promises.push(this.tabService.save(tab));
    });
    return Promise.all(promises).then(() => {
    });
  }

  private migrateNotes( data: ChromeStorageData ): Promise<void> {
    if (!data['Note']) {
      return Promise.resolve();
    }
    const promises: Promise<any>[] = [];

    data['Note'].forEach(( noteId: string ) => {
      const chromeNote = data[noteId];
      if (!chromeNote) {
        return;
      }
      const note = new Note(
        chromeNote.title,
        chromeNote.text,
        chromeNote.color
      );
      promises.push(this.noteService.save(note));
    });

    return Promise.all(promises).then(() => {
    });
  }

  private migrateAnime( data: ChromeStorageData ): Promise<any> {
    if (!data['Anime']) {
      return Promise.resolve();
    }
    const promises: Promise<any>[] = [];

    data['Anime'].forEach(( animeId: string ) => {
      const chromeAnime = data[animeId];
      if (!chromeAnime) {
        return;
      }
      const anime = new Anime(
        chromeAnime.title,
        chromeAnime.anidbId,
        chromeAnime.episodes.map(( e: any ) => new Episode(e.episodeNumber, e.airdate)),
        chromeAnime.nyaaSearch ? new NyaaSearch(chromeAnime.nyaaSearch.replace(' %n_10', '')) : undefined
      );
      promises.push(this.animeService.save(anime));
    });

    return Promise.all(promises);
  }

  private migrateMusic( data: ChromeStorageData ): Promise<any> {
    if (!data['Song']) {
      return Promise.resolve();
    }
    const promises: Promise<any>[] = [];

    data['Song'].forEach(( songId: string ) => {
      const chromeSong = data[songId];
      if (!chromeSong) {
        return;
      }
      const song = new Song(
        chromeSong.show,
        chromeSong.type,
        chromeSong.title,
        chromeSong.author,
        chromeSong.releaseDate,
        chromeSong.anidbId,
        chromeSong.anisonId
      );
      promises.push(this.songService.save(song));
    })

    return Promise.all(promises);
  }

  private migrateOva( data: ChromeStorageData ): Promise<any> {
    if (!data['Ova']) {
      return Promise.resolve();
    }
    const promises: Promise<any>[] = [];

    data['Ova'].forEach(( ovaId: string ) => {
      const chromeOva = data[ovaId];
      if (!chromeOva) {
        return;
      }
      const ova = new Ova(
        chromeOva.title,
        chromeOva.anidbId,
        chromeOva.airdate
      );
      promises.push(this.ovaService.save(ova))
    })

    return Promise.all(promises);
  }

  private migrateShows( data: ChromeStorageData ): Promise<any> {
    if (!data['Show']) {
      return Promise.resolve();
    }
    const promises: Promise<any>[] = [];

    data['Show'].forEach((showId: string) => {
      const chromeShow = data[showId];
      if (!chromeShow) {
        return;
      }
      const show = new Show(
        chromeShow.title,
        chromeShow.tvdbId,
        chromeShow.url,
        chromeShow.episodes.map(( e: any ) => new Episode(e.episodeNumber, e.airdate)),
      );
      promises.push(this.showService.save(show));
    });

    return Promise.all(promises);
  }

  private migrateManga( data: ChromeStorageData ): Promise<any> {
    if (!data['Manga']) {
      return Promise.resolve();
    }
    const promises: Promise<any>[] = [];

    data['Manga'].forEach((mangaId: string) => {
      const chromeManga = data[mangaId];
      if (!chromeManga) {
        return;
      }
      const manga = new Manga(
        chromeManga.title,
        chromeManga.amazonId,
        chromeManga.episodes.map(( e: any ) => new Episode(e.episodeNumber, e.airdate)),
        chromeManga.lastRead
    );
      promises.push(this.mangaService.save(manga))
    });

    return Promise.all(promises);
  }
}
