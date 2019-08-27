import { AChromeService } from '../../../services/achrome.service';

export class SongService extends AChromeService {
  protected getTypeName(): string {
    return 'Song';
  }
}
