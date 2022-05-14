import { Injectable } from '@angular/core';
import { KirinoSettingsService } from '../../data/kirino/kirino-settings.service';
import { AnimeSyncService } from './anime-sync.service';
import { OvaSyncService } from './ova-sync.service';
import { MangaSyncService } from './manga-sync.service';
import { ShowSyncService } from './show-sync.service';
import { MusicSyncService } from './music-sync.service';
import { LocalPreferenceService } from '../../data/local-preference.service';
import { ASyncService } from './ASyncService';

@Injectable({
  providedIn: 'root'
})
export class KirinoSyncService {

  private static readonly MIN_SYNC_DELAY = 60 * 60 * 1000;

  private automaticSyncEnabled = false;
  private syncs: {
    key: string,
    service: ASyncService<any>
  }[] = [];

  constructor(
    kirinoSettings: KirinoSettingsService,
    private localPreference: LocalPreferenceService,
    private animeSync: AnimeSyncService,
    private ovaSync: OvaSyncService,
    private mangaSync: MangaSyncService,
    private showSync: ShowSyncService,
    private musicSync: MusicSyncService
  ) {
    kirinoSettings.asObservable().subscribe(settings => this.automaticSyncEnabled = settings.automaticSync);
    this.syncs = [
      {key: 'kirinoLastAnimeSync', service: this.animeSync},
      {key: 'kirinoLastOvaSync', service: this.ovaSync},
      {key: 'kirinoLastMangaSync', service: this.mangaSync},
      {key: 'kirinoLastShowSync', service: this.showSync},
      {key: 'kirinoLastMusicSync', service: this.musicSync},
    ];
  }

  public run(): Promise<any> {
    const promises: Promise<any>[] = [];
    this.syncs.forEach(( {key, service} ) => {
      const lastSync = this.localPreference.get(key, 0);
      if (Date.now() - lastSync < KirinoSyncService.MIN_SYNC_DELAY) {
        return;
      }
      console.log(`Kirino sync started for ${key}`);
      const promise = service.syncAll(false, true).then(() => {
        this.localPreference.set(key, Date.now());
      });
      promise.then(() => console.log(`Kirino sync finished for ${key}`));
      promises.push(promise);
    });
    return Promise.all(promises);
  }
}
