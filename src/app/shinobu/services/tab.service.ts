import { AChromeService } from '../../services/achrome.service';

export class TabService extends AChromeService {
  protected getTypeName(): string {
    return 'Tab';
  }
}
