import { AChromeService } from '../../../services/achrome.service';

export class AnimeService extends AChromeService {
  protected getTypeName(): string {
    return 'Anime';
  }
}
