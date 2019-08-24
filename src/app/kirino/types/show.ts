import {Episode} from './episode';
import {Episodic} from './episodic';

export class Show implements Episodic {
  public id: number;

  constructor(
    public title: string,
    public tvdbId: number,
    public url: string,
    public episodes: Episode[] = []
  ) {

  }
}
