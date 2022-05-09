/// <reference types="chrome" />
import { Injectable } from '@angular/core';
import { TabService } from '../data/shinobu/tab.service';
import { Tab } from '../../data/shinobu/Tab';
import { Tile } from '../../data/shinobu/Tile';
import { NoteService } from '../data/shinobu/note.service';
import { Note } from '../../data/shinobu/Note';

type ChromeStorageData = { [key: string]: any };

@Injectable({
  providedIn: 'root'
})
export class MigrationService {

  private static readonly MIGRATED_FLAG = 'SHINOBU_V4_MIGRATED';
  private static readonly MIGRATE_FIELDS = ['Note', 'Tab'];

  constructor( private tabService: TabService, private noteService: NoteService ) {
  }

  public migrate(): Promise<void> {
    if (!chrome && !chrome.storage && !chrome.storage.sync) {
      return Promise.reject();
    }
    return new Promise<void>(resolve => chrome.storage.sync.get(data => {
      this.migrateTabs(data)
        .then(() => this.migrateNotes(data))
        // TODO: Migrate Anime
        // TODO: Migrate Music
        // TODO: Migrate OVAs
        // TODO: Migrate TV Shows
        // TODO: Migrate Manga
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
}
