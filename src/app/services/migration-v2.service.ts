import { Injectable } from '@angular/core';
import { ChromeStorageProviderService } from './chrome-storage-provider.service';
import { NoteService } from '../modules/shinobu/services/note.service';
import { Note } from '../modules/shinobu/types/note';
import { NoteColor } from '../modules/shinobu/types/note-color.enum';

@Injectable({
  providedIn: 'root'
})
export class MigrationV2Service {

  constructor(
    private chromeStorageProvider: ChromeStorageProviderService,
    private noteService: NoteService,
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
      .then(() => this.migrateNotes(data));
  }

  private clearAll(): Promise<void> {
    const promises = [];
    promises.push(new Promise<void>(resolve => this.chromeStorageProvider.getLocal().clear(() => resolve())));
    promises.push(new Promise<void>(resolve => this.chromeStorageProvider.getSync().clear(() => resolve())));
    return new Promise<void>(resolve => Promise.all(promises).then(() => resolve()));
  }

  private firstUppercase(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  private async migrateNotes( data: object ): Promise<void> {
    const addPromises = [];
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
}
