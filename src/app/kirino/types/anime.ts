import {Episode} from './episode';
import {Episodic} from './episodic';

export class Anime implements Episodic {
  public id: number;

  constructor(
    public title: string,
    public anidId: number,
    public nyaaSearch: string = null,
    public episodes: Episode[] = []
  ) {
  }
}
