import { AEpisodic } from './AEpisodic';
import { Episode } from './Episode';

export class Manga extends AEpisodic {
  constructor(
    title: string = '',
    public amazonId: string = '',
    episodes: Episode[] = [],
    public nyaaSearch = '',
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
}
