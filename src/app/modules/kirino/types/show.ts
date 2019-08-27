import { Episode } from './episode';
import { Episodic } from './episodic';

export class Show implements Episodic {
  public id: number;

  constructor(
    public title: string = null,
    public tvdbId: string = null,
    public url: string = null,
    public episodes: Episode[] = []
  ) {

  }
}
