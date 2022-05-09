import { ASavable } from '../../../data/ASavable';
import { Episode } from './Episode';

export abstract class AEpisodic extends ASavable {
  public title: string = '';
  public episodes: Episode[] = [];
  public lastSeen: number = 0;
}
