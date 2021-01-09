import { Injectable } from '@angular/core';
import { Manga } from '../../../kirino/types/manga';
import { MangaService } from '../../../kirino/services/manga.service';
import { MangaParserService } from '../../../../services/parsers/manga-parser.service';
import { LocalPreferenceService } from '../../../../services/local-preference.service';
import { MessageService } from '../../../../services/message.service';
import { Episode } from '../../../kirino/types/episode';
import { Preference } from '../../../settings/types/preference';
import { Anime } from '../../../kirino/types/anime';
import { SyncHelper } from './sync-helper';
import { AnimeBoxComponent } from '../../../kirino/components/anime-box/anime-box.component';
import { MangaBoxComponent } from '../../../kirino/components/manga-box/manga-box.component';

@Injectable({
  providedIn: 'root'
})
export class MangaSyncService {

  private static readonly SYNC_TIME_KEY = 'LAST_MANGA_SYNC';
  private static readonly DELAY = 24 * 60 * 1000;

  constructor(
    private mangaService: MangaService,
    private mangaParser: MangaParserService,
    private localPreferenceService: LocalPreferenceService,
    public messageService: MessageService,
  ) {
  }

  public sync( id: number ): Promise<Manga> {
    return this.mangaService.get(id).then(( manga: Manga ) => this.syncManga(manga));
  }

  public syncAll( preference: Preference ): Promise<void> {
    return this.localPreferenceService.get(MangaSyncService.SYNC_TIME_KEY, 0).then(( lastSync: number ) => {
      const now = Date.now();
      const nextSync = lastSync
        + (preference.kirino.amazonRefreshRateInMin ? preference.kirino.amazonRefreshRateInMin : 24 * 60) * 60 * 1000;
      console.log('Checking Manga sync, last sync=' + lastSync + ', next sync=' + nextSync);
      if (now < nextSync) {
        console.log('Manga sync not needed');
        return Promise.resolve();
      }
      return this.localPreferenceService.set(MangaSyncService.SYNC_TIME_KEY, now).then(() => {
        console.log('Set new Manga last sync');
        return this.mangaService.getAll();
      }).then(async ( mangas: Manga[] ) => {
        const last = mangas[mangas.length - 1];
        for (const manga of mangas) {
          console.log('Syncing Manga ' + manga.title);
          await this.syncManga(manga);
          if (manga !== last) {
            await SyncHelper.delay(MangaSyncService.DELAY);
          }
        }
        this.messageService.sendMessage(MangaBoxComponent.SYNC_KEY, 'reload');
        return Promise.resolve();
      });
    });
  }

  private syncManga( manga: Manga ): Promise<Manga> {
    if (!manga || !manga.amazonId) {
      return Promise.resolve(manga);
    }
    const url = MangaParserService.getApiUrl(manga.amazonId, manga.lastParsedPage);
    return this.mangaParser.getData(url).then(( updatedData: Manga ) => {
      return updatedData;
    }).then(( updatedData: Manga ) => {
      if (updatedData.episodes.length === MangaParserService.PAGE_SIZE) {
        manga.lastParsedPage += 1;
        this.updateEpisodes(manga, updatedData.episodes);
        return this.syncManga(manga);
      }
      this.updateEpisodes(manga, updatedData.episodes);
      return this.mangaService.save(manga).then(() => manga);
    });
  }

  private updateEpisodes( manga: Manga, episodes: Episode[] ): void {
    const existingEpisodes = new Set<string>();
    manga.episodes.forEach(e => existingEpisodes.add(e.episodeNumber));
    for (const episode of episodes) {
      if (existingEpisodes.has(episode.episodeNumber)) {
        continue;
      }
      if (+episode.episodeNumber <= manga.lastRead) {
        continue;
      }
      manga.episodes.push(episode);
    }
  }
}
