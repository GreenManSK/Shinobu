import { AEpisodic } from './AEpisodic';
import { Episode } from './Episode';

export class Show extends AEpisodic {
  constructor(
    title: string = '',
    public tvdbId: number = 0,
    public url: string = '',
    episodes: Episode[] = [],
    lastSeen: number = 0
  ) {
    super();
    this.title = title;
    this.episodes = episodes;
    this.lastSeen = lastSeen;
  }
}