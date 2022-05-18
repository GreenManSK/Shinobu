import { AEpisodic } from './AEpisodic';
import { Episode } from './Episode';

export class Manga extends AEpisodic {
  constructor(
    title: string = '',
    public amazonId: string = '',
    episodes: Episode[] = [],
    lastSeen: number = 0,
    public lastParsedPage: number = 0
  ) {
    super();
    this.title = title;
    this.episodes = episodes;
    this.lastSeen = lastSeen;
  }

  override toPlainObject(): any {
    return {
      ...this,
      episodes: this.episodes.map(e => ({...e}))
    }
  }

  public parseEpisodeNumber( episodeNumber: string ): number {
    const match = episodeNumber.match(/(\d+)/);
    if (match === null) {
      return -1;
    }
    return +match[1];
  }

}
