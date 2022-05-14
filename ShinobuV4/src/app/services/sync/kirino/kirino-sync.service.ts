import { Injectable } from '@angular/core';
import { KirinoSettingsService } from '../../data/kirino/kirino-settings.service';
import { AnimeSyncService } from './anime-sync.service';
import { OvaSyncService } from './ova-sync.service';
import { MangaSyncService } from './manga-sync.service';
import { ShowSyncService } from './show-sync.service';
import { MusicSyncService } from './music-sync.service';
import { LocalPreferenceService } from '../../data/local-preference.service';

@Injectable({
  providedIn: 'root'
})
export class KirinoSyncService {

  private static readonly LAST_SYNC_KEY = 'kirinoLastSync';
  private static readonly MIN_SYNC_DELAY = 60 * 60 * 1000;

  private automaticSyncEnabled = false;

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
  }

  public run(): Promise<void> {
    const lastSync = this.localPreference.get(KirinoSyncService.LAST_SYNC_KEY, 0);
    if (Date.now() - lastSync < KirinoSyncService.MIN_SYNC_DELAY) {
      return Promise.resolve();
    }
    return this.syncAll().then(() => {
      this.localPreference.set(KirinoSyncService.LAST_SYNC_KEY, Date.now());
    });
  }

  private syncAll(): Promise<void> {
    console.log('Kirino sync started');
    const syncPromises = [
      this.animeSync.syncAll(false, true),
      this.ovaSync.syncAll(false, true),
      this.mangaSync.syncAll(false, true),
      this.showSync.syncAll(false, true),
      this.musicSync.syncAll(false, true),
    ];
    return Promise.all(syncPromises).then(() => {
      console.log('Kirino sync finished');
    });
  }
}
