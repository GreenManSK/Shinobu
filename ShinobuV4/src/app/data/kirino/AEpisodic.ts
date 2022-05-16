import { Episode } from './Episode';
import { ASyncable } from './ASyncable';

export abstract class AEpisodic extends ASyncable {
  public title: string = '';
  public episodes: Episode[] = [];
  public lastSeen: number = 0;

  public abstract parseEpisodeNumber(episodeNumber: string): number;
}
