import { Episode } from './episode';
import { Savable } from '../../../types/savable';

export interface Episodic extends Savable {
  title: string;
  episodes: Episode[];
}
