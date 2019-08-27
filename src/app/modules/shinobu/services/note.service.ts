import { AChromeService } from '../../../services/achrome.service';

export class NoteService extends AChromeService {
  protected getTypeName(): string {
    return 'Note';
  }
}
