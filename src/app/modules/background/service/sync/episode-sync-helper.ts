import { Episodic } from '../../../kirino/types/episodic';
import { Episode } from '../../../kirino/types/episode';

type EpisodeMapType = { [episodeNumber: number]: Episode };

export class EpisodeSyncHelper {
  private constructor() {
  }

  public static updateEpisodes( show: Episodic, newEpisodes: Episode[] ): Episodic {
    const episodeMap = this.buildEpisodeMap(show);
    const now = Date.now();
    newEpisodes = newEpisodes.filter((ep) => {
      const exists = episodeMap.hasOwnProperty(ep.episodeNumber);
      if (exists) {
        episodeMap[ep.episodeNumber].airdate = ep.airdate;
      }
      return ep.airdate > now && !exists;
    });
    show.episodes = show.episodes.concat(newEpisodes);
    return show;
  }

  private static buildEpisodeMap( show: Episodic ): EpisodeMapType {
    const episodeMap: EpisodeMapType = {};
    for (const episode of show.episodes) {
      episodeMap[episode.episodeNumber] = episode;
    }
    return episodeMap;
  }
}
