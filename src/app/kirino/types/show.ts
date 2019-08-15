import {Episode} from './episode';
import {Episodic} from './episodic';

export class Show implements Episodic {
  constructor(
    public id: number,
    public title: string,
    public anidId: number,
    public nyaaSearch: string,
    public episodes: Episode[] = []
  ) {

  }
}
