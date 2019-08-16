import {Injectable} from '@angular/core';
import {AChromeService} from '../../services/achrome.service';

@Injectable({
  providedIn: 'root'
})

export class OvaService extends AChromeService {
  protected getTypeName(): string {
    return 'Ova';
  }
}
