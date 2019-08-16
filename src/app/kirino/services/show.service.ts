import { AChromeService } from '../../services/achrome.service';

export class ShowService extends AChromeService {
  protected getTypeName(): string {
    return 'Show';
  }
}
