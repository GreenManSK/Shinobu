import {Injectable} from '@angular/core';
import {AChromeService} from '../../services/achrome.service';

@Injectable({
  providedIn: 'root'
})

export class TabService extends AChromeService {
  protected getTypeName(): string {
    return 'Tab';
  }
}
