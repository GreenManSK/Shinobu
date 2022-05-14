import { Injectable } from '@angular/core';
import { Anime } from '../../../data/kirino/Anime';
import { KirinoSettingsService } from '../../data/kirino/kirino-settings.service';
import { AlertService } from '../../alert.service';
import { AnimeService } from '../../data/kirino/anime.service';
import { ASyncService } from './ASyncService';
import { AnidbParserService } from '../../parsers/kirino/anidb-parser.service';
import { EpisodeSyncHelper } from './episode-sync-helper';
import { InternetConnectionService } from '../../internet-connection.service';
import { AlertType } from '../../../types/AlertType';

@Injectable({
  providedIn: 'root'
})
export class AnimeSyncService extends ASyncService<Anime> {

  public static readonly SYNC_KEY = 'anidb';
  public static readonly DEFAULT_SYNC_TIME_IN_MINS = 2 * 60;
  private static readonly DELAY = 0.5 * 60 * 1000;

  constructor(
    kirinoSettingsService: KirinoSettingsService,
    alertService: AlertService,
    private service: AnimeService,
    private parser: AnidbParserService,
    private internetConnectionService: InternetConnectionService
  ) {
    super(kirinoSettingsService, alertService);
  }

  public sync( item: Anime, force = false, log = false ): Promise<Anime> {
    if (!this.internetConnectionService.isConnected()) {
      return Promise.resolve(item);
    }
    const shouldSync = force || this.shouldSync(item, AnimeSyncService.SYNC_KEY, AnimeSyncService.DEFAULT_SYNC_TIME_IN_MINS);
    const dismissAlert = this.log(log, `${item.id}/${item.title} (force: ${force ? 'yes' : 'no'}) - ${shouldSync ? 'syncing' : 'skipping'}`, AlertType.warning, shouldSync);
    if (!shouldSync) {
      return Promise.resolve(item);
    }
    const url = AnidbParserService.getApiUrl(item.anidbId);
    return this.parser.getData(url).then(updatedData => {
      if (updatedData) {
        EpisodeSyncHelper.updateEpisodes(item, updatedData.episodes);
      }
      item.lastSync = Date.now();
      return this.service.save(item);
    }).then(item => {
      dismissAlert();
      return item;
    }).catch(item => {
      this.log(log, `Problem syncing ${item.id}/${item.title}`, AlertType.error)
      return item;
    });
  }

  public syncAll( force: boolean, log: boolean ): Promise<void> {
    return this.syncAllItems(force, log, this.service, AnimeSyncService.DELAY);
  }

  protected getName(): string {
    return 'AnimeSync';
  }
}
