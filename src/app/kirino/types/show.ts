import {Episode} from './episode';
import {Episodic} from './episodic';

export class Show implements Episodic {
  public id: number;

  constructor(
    public title: string,
    public tvdbId: string,
    public url: string = null,
    public episodes: Episode[] = []
  ) {

  }
}
