import {Episode} from './episode';
import {Episodic} from './episodic';

export class Show implements Episodic {
  public id: number;

  constructor(
    public title: string,
    public anidId: number,
    public nyaaSearch: string,
    public episodes: Episode[] = []
  ) {

  }
}
