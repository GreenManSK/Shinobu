import { Injectable } from '@angular/core';
import { ASyncService } from './ASyncService';
import { Manga } from '../../../data/kirino/Manga';
import { KirinoSettingsService } from '../../data/kirino/kirino-settings.service';
import { AlertService } from '../../alert.service';
import { MangaService } from '../../data/kirino/manga.service';
import { MangaParserService } from '../../parsers/kirino/manga-parser.service';
import { Episode } from '../../../data/kirino/Episode';
import { InternetConnectionService } from '../../internet-connection.service';
import { AlertType } from '../../../types/AlertType';

@Injectable({
  providedIn: 'root'
})
export class MangaSyncService extends ASyncService<Manga> {

  public static readonly SYNC_KEY = 'amazon';
  public static readonly DEFAULT_SYNC_TIME_IN_MINS = 24 * 60;
  private static readonly DELAY = 1 * 60 * 1000;

  constructor(
    kirinoSettingsService: KirinoSettingsService,
    alertService: AlertService,
    private service: MangaService,
    private parser: MangaParserService,
    private internetConnectionService: InternetConnectionService
  ) {
    super(kirinoSettingsService, alertService);
  }

  public sync( item: Manga, force = false, log = false ): Promise<Manga> {
    if (!this.internetConnectionService.isConnected()) {
      return Promise.resolve(item);
    }
    if (!item.amazonId) {
      return Promise.resolve(item);
    }
    const shouldSync = force || !this.isSynced(item);
    if (!shouldSync) {
      return Promise.resolve(item);
    }
    const dismissAlert = this.log(log, `${item.id}/${item.title} (force: ${force ? 'yes' : 'no'}) - ${shouldSync ? 'syncing' : 'skipping'}`, AlertType.warning, shouldSync);
    return this.syncManga(item).then(item => {
      dismissAlert?.();
      return item;
    }).catch(item => {
      this.log(log, `Problem syncing ${item.id}/${item.title}`, AlertType.error)
      return item;
    });
  }

  public syncAll( force: boolean, log: boolean ): Promise<void> {
    return this.syncAllItems(force, log, this.service, MangaSyncService.DELAY);
  }

  public isSynced(item: Manga): boolean {
    return !this.shouldSync(item, MangaSyncService.SYNC_KEY, MangaSyncService.DEFAULT_SYNC_TIME_IN_MINS);
  }

  protected getName(): string {
    return 'MangaSync';
  }

  private syncManga( manga: Manga ): Promise<Manga> {
    const url = MangaParserService.getApiUrl(manga.amazonId, manga.lastParsedPage);
    return this.parser.getData(url).then(updatedData => {
      this.updateEpisodes(manga, updatedData.episodes);
      if (updatedData.episodes.length === MangaParserService.PAGE_SIZE) {
        manga.lastParsedPage += 1;
        return this.syncManga(manga);
      }
      manga.lastSync = Date.now();
      return this.service.save(manga);
    });
  }

  private updateEpisodes( manga: Manga, episodes: Episode[] ): void {
    const existingEpisodes = new Map<string, Episode>();
    manga.episodes.forEach(e => existingEpisodes.set(e.number, e));
    for (const episode of episodes) {
      if (existingEpisodes.has(episode.number)) {
        const storedEpisode = existingEpisodes.get(episode.number);
        if (episode.airdate !== 0 && storedEpisode) {
          storedEpisode.airdate = episode.airdate;
        }
        continue;
      }
      if (manga.parseEpisodeNumber(episode.number) <= manga.lastSeen) {
        continue;
      }
      manga.episodes.push(episode);
    }
  }
}
