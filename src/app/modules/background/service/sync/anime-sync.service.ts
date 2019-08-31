import { Injectable } from '@angular/core';
import { AnimeService } from '../../../kirino/services/anime.service';
import { AnidbParserService } from '../../../../services/parsers/anidb-parser.service';
import { Anime } from '../../../kirino/types/anime';
import { EpisodeSyncHelper } from './episode-sync-helper';

@Injectable({
  providedIn: 'root'
})
export class AnimeSyncService {

  constructor(
    private animeService: AnimeService,
    private animeParser: AnidbParserService
  ) {
  }

  public sync( id: number ): Promise<Anime> {
    return this.animeService.get(id).then(( anime: Anime ) => {
      if (!anime || !anime.anidbId) {
        return anime;
      }
      const url = AnidbParserService.getApiUrl(anime.anidbId);
      return this.animeParser.getData(url).then(( updatedData: Anime ) => {
        if (updatedData) {
          EpisodeSyncHelper.updateEpisodes(anime, updatedData.episodes);
          return this.animeService.save(anime).then(() => anime);
        }
        return anime;
      });
    });
  }
}
