import { AEpisodic } from './AEpisodic';
import { Episode } from './Episode';
import { NyaaSearch } from './NyaaSearch';

export class Anime extends AEpisodic {
  constructor(
    title: string = '',
    public anidbId: number = 0,
    episodes: Episode[] = [],
    public nyaaSearch?: NyaaSearch,
    lastSeen: number = 0
  ) {
    super();
    this.title = title;
    this.episodes = episodes;
    this.lastSeen = lastSeen;
  }

  override toPlainObject(): any {
    return {
      ...this,
      nyaaSearch: {...this.nyaaSearch},
      episodes: this.episodes.map(e => ({...e}))
    }
  }

  public parseEpisodeNumber( episodeNumber: string ): number {
    return +episodeNumber;
  }
}
