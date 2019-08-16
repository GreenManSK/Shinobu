import { AChromeService } from '../../services/achrome.service';

export class OvaService extends AChromeService {
  protected getTypeName(): string {
    return 'Ova';
  }
}
