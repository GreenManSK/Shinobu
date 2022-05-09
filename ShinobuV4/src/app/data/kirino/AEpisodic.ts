import { Episode } from './Episode';
import { ASavable } from '../ASavable';

export abstract class AEpisodic extends ASavable {
  public title: string = '';
  public episodes: Episode[] = [];
  public lastSeen: number = 0;
}
