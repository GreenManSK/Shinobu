import { Injectable } from '@angular/core';
import { ASyncService } from './ASyncService';
import { Manga } from '../../../data/kirino/Manga';
import { KirinoSettingsService } from '../../data/kirino/kirino-settings.service';
import { AlertService } from '../../alert.service';
import { MangaService } from '../../data/kirino/manga.service';
import { MangaParserService } from '../../parsers/kirino/manga-parser.service';
import { Episode } from '../../../data/kirino/Episode';
import { InternetConnectionService } from '../../internet-connection.service';

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
    const shouldSync = force || this.shouldSync(item, MangaSyncService.SYNC_KEY, MangaSyncService.DEFAULT_SYNC_TIME_IN_MINS);
    if (!shouldSync) {
      return Promise.resolve(item);
    }
    return this.syncManga(item);
  }

  public syncAll( force: boolean, log: boolean ): Promise<void> {
    return this.syncAllItems(force, log, this.service, MangaSyncService.DELAY);
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
    const existingEpisodes = new Set<string>();
    manga.episodes.forEach(e => existingEpisodes.add(e.number));
    for (const episode of episodes) {
      if (existingEpisodes.has(episode.number)) {
        continue;
      }
      if (+episode.number <= manga.lastSeen) {
        continue;
      }
      manga.episodes.push(episode);
    }
  }
}
