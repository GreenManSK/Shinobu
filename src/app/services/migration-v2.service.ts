import { Injectable } from '@angular/core';
import { ChromeStorageProviderService } from './chrome-storage-provider.service';
import { NoteService } from '../modules/shinobu/services/note.service';
import { Note } from '../modules/shinobu/types/note';
import { NoteColor } from '../modules/shinobu/types/note-color.enum';
import { Tile } from '../modules/shinobu/types/tile';
import { TabService } from '../modules/shinobu/services/tab.service';
import { Tab } from '../modules/shinobu/types/tab';

@Injectable({
  providedIn: 'root'
})
export class MigrationV2Service {

  constructor(
    private chromeStorageProvider: ChromeStorageProviderService,
    private noteService: NoteService,
    private tabService: TabService
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
      .then(() => this.migrateQuickAccess(data));
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
}
