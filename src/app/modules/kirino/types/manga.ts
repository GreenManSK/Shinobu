import { Episodic } from './episodic';
import { Episode } from './episode';

export class Manga implements Episodic {
  public id: number;

  constructor(
    public title: string = null,
    public amazonId: string = null,
    public lastSeen: number = 0,
    public episodes: Episode[] = [],
    public lastParsedPage: number = 0
  ) {
  }
}
