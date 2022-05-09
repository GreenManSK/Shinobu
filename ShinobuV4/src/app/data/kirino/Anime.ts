import { AEpisodic } from './AEpisodic';
import { Episode } from './Episode';

export class Anime extends AEpisodic {
  constructor(
    title: string = '',
    public anidbId: number = 0,
    episodes: Episode[] = [],
    public nyaaSearch = '',
    lastSeen: number = 0
  ) {
    super();
    this.title = title;
    this.episodes = episodes;
    this.lastSeen = lastSeen;
  }
}
