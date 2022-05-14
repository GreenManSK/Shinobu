import { Injectable } from '@angular/core';
import { Anime } from '../../../data/kirino/Anime';
import { KirinoSettingsService } from '../../data/kirino/kirino-settings.service';
import { AlertService } from '../../alert.service';
import { AnimeService } from '../../data/kirino/anime.service';
import { ASyncService } from './ASyncService';
import { AnidbParserService } from '../../parsers/kirino/anidb-parser.service';
import { EpisodeSyncHelper } from './episode-sync-helper';
import { first } from 'rxjs';
import { SyncHelper } from './sync-helper';

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
    private parser: AnidbParserService ) {
    super(kirinoSettingsService, alertService);
  }

  public sync( item: Anime, force = false, log = false ): Promise<Anime> {
    const shouldSync = force || this.shouldSync(item, AnimeSyncService.SYNC_KEY, AnimeSyncService.DEFAULT_SYNC_TIME_IN_MINS);
    this.log(log, `${item.id}/${item.title} (force: ${force ? 'yes' : 'no'}) - ${shouldSync ? 'syncing' : 'skipping'}`);
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
    });
  }

  protected syncAllItems( force = false, log = false ): Promise<void> {
    return new Promise<void>(resolve => {
      this.service.getAll().pipe(first()).subscribe(async ( animes ) => {
        const last = animes[animes.length - 1];
        for (const anime of animes) {
          const lastSync = anime.lastSync;
          await this.sync(anime, force, log);
          if (anime !== last && anime.lastSync !== lastSync) {
            await SyncHelper.delay(AnimeSyncService.DELAY);
          }
        }
        resolve();
      });
    });
  }

  protected getName(): string {
    return 'AnimeSync';
  }
}
