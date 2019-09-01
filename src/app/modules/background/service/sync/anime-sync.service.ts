import { Injectable } from '@angular/core';
import { AnimeService } from '../../../kirino/services/anime.service';
import { AnidbParserService } from '../../../../services/parsers/anidb-parser.service';
import { Anime } from '../../../kirino/types/anime';
import { EpisodeSyncHelper } from './episode-sync-helper';
import { LocalPreferenceService } from '../../../../services/local-preference.service';
import { MessageService } from '../../../../services/message.service';
import { Preference } from '../../../settings/types/preference';
import { SyncHelper } from './sync-helper';
import { AnimeBoxComponent } from '../../../kirino/components/anime-box/anime-box.component';

@Injectable({
  providedIn: 'root'
})
export class AnimeSyncService {

  private static readonly SYNC_TIME_KEY = 'LAST_ANIME_SYNC';
  private static readonly DELAY = 3 * 60 * 1000;

  constructor(
    private animeService: AnimeService,
    private animeParser: AnidbParserService,
    private localPreferenceService: LocalPreferenceService,
    public messageService: MessageService,
  ) {
  }

  public sync( id: number ): Promise<Anime> {
    return this.animeService.get(id).then(( anime: Anime ) => this.syncAnime(anime));
  }

  private syncAnime( anime: Anime ): Promise<Anime> {
    if (!anime || !anime.anidbId) {
      return Promise.resolve(anime);
    }
    const url = AnidbParserService.getApiUrl(anime.anidbId);
    return this.animeParser.getData(url).then(( updatedData: Anime ) => {
      if (updatedData) {
        EpisodeSyncHelper.updateEpisodes(anime, updatedData.episodes);
        return this.animeService.save(anime).then(() => anime);
      }
      return anime;
    });
  }

  public syncAll( preference: Preference ): Promise<void> {
    return this.localPreferenceService.get(AnimeSyncService.SYNC_TIME_KEY, 0).then(( lastSync: number ) => {
      const now = Date.now();
      const nextSync = lastSync + preference.kirino.anidbRefreshRateInMin * 60 * 1000;
      console.log('Checking Anime sync, last sync=' + lastSync + ', next sync=' + nextSync);
      if (now < nextSync) {
        console.log('Anime sync not needed');
        return Promise.resolve();
      }
      return this.localPreferenceService.set(AnimeSyncService.SYNC_TIME_KEY, now).then(() => {
        console.log('Set new Anime last sync');
        return this.animeService.getAll();
      }).then(async ( animes: Anime[] ) => {
        const last = animes[animes.length - 1];
        for (const anime of animes) {
          console.log('Syncing Anime ' + anime.title);
          await this.syncAnime(anime);
          if (anime !== last) {
            await SyncHelper.delay(AnimeSyncService.DELAY);
          }
        }
        this.messageService.sendMessage(AnimeBoxComponent.SYNC_KEY, 'reload');
        return Promise.resolve();
      });
    });
  }

}
