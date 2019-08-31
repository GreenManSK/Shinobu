import { Episode } from './episode';
import { Episodic } from './episodic';

export class Anime implements Episodic {
  public id: number;

  constructor(
    public title: string = null,
    public anidbId: number = null,
    public nyaaSearch: string = null,
    public episodes: Episode[] = []
  ) {
  }
}
