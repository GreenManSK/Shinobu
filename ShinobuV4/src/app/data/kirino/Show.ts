import { AEpisodic } from './AEpisodic';
import { Episode } from './Episode';

export class Show extends AEpisodic {
  constructor(
    title: string = '',
    public tvdbId: string = '',
    public url: string = '',
    episodes: Episode[] = [],
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
      episodes: this.episodes.map(e => ({...e}))
    };
  }

  public parseEpisodeNumber( episodeNumber: string ): number {
    const match = episodeNumber.match(/^S(\d+)E(\d+)$/);
    if (match === null) {
      return -1;
    }
    return +match[1] * 1000 + +match[2];
  }

}
