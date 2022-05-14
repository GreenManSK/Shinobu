import { Episode } from '../../../data/kirino/Episode';
import { AEpisodic } from '../../../data/kirino/AEpisodic';

type EpisodeMapType = { [episodeNumber: string]: Episode };

export class EpisodeSyncHelper {
  private constructor() {
  }

  public static updateEpisodes<T extends AEpisodic>( show: T, newEpisodes: Episode[] ): T {
    const episodeMap = this.buildEpisodeMap(show);
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);
    const now = startOfDay.getTime();
    newEpisodes = newEpisodes.filter(( ep ) => {
      const exists = episodeMap.hasOwnProperty(ep.number);
      if (exists) {
        episodeMap[ep.number].airdate = ep.airdate;
      }
      return ep.airdate >= now && !exists;
    });
    show.episodes = show.episodes.concat(newEpisodes);
    return show;
  }

  private static buildEpisodeMap( show: AEpisodic ): EpisodeMapType {
    const episodeMap: EpisodeMapType = {};
    for (const episode of show.episodes) {
      episodeMap[episode.number] = episode;
    }
    return episodeMap;
  }
}
