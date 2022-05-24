import {Injectable} from '@angular/core';
import {KirinoSettingsService} from '../../data/kirino/kirino-settings.service';
import {AnimeSyncService} from './anime-sync.service';
import {OvaSyncService} from './ova-sync.service';
import {MangaSyncService} from './manga-sync.service';
import {ShowSyncService} from './show-sync.service';
import {MusicSyncService} from './music-sync.service';
import {LocalPreferenceService} from '../../data/local-preference.service';
import {ASyncService} from './ASyncService';
import {first, Subscription} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KirinoSyncService {

  private static readonly MIN_SYNC_DELAY = 60 * 60 * 1000;
  private static readonly DELAY_ON_START = 0; //10 * 1000;

  private syncs: {
    key: string,
    service: ASyncService<any>
  }[] = [];

  constructor(
    private kirinoSettings: KirinoSettingsService,
    private localPreference: LocalPreferenceService,
    private animeSync: AnimeSyncService,
    private ovaSync: OvaSyncService,
    private mangaSync: MangaSyncService,
    private showSync: ShowSyncService,
    private musicSync: MusicSyncService
  ) {
    this.syncs = [
      {key: 'kirinoLastAnimeSync', service: this.animeSync},
      {key: 'kirinoLastOvaSync', service: this.ovaSync},
      {key: 'kirinoLastMangaSync', service: this.mangaSync},
      {key: 'kirinoLastShowSync', service: this.showSync},
      {key: 'kirinoLastMusicSync', service: this.musicSync},
    ];
  }

  public run() {
    setTimeout(() => {
      return this.kirinoSettings.onReady().then(() => {
        let subscription: Subscription;
        subscription = this.kirinoSettings.asObservable().subscribe(settings => {
          if (!settings.id) {
            return;
          }
          subscription?.unsubscribe();
          if (!settings.automaticSync) {
            return;
          }
          if (Date.now() - settings.lastRefresh < KirinoSyncService.MIN_SYNC_DELAY) {
            return;
          }
          const promises: Promise<any>[] = [];
          this.syncs.forEach(({key, service}) => {
            console.log(`Kirino sync started for ${key}`);
            const promise = service.syncAll(false, true)
            promise.then(() => console.log(`Kirino sync finished for ${key}`));
            promises.push(promise);
          });
          return Promise.all(promises).then(() => {
            const settings = this.kirinoSettings.get();
            settings.lastRefresh = Date.now();
            this.kirinoSettings.update(settings);
          });
        });
      });
    }, KirinoSyncService.DELAY_ON_START);
  }
}
