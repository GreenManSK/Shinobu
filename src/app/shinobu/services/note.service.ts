import {Injectable} from '@angular/core';
import {AChromeService} from '../../services/achrome.service';

@Injectable({
  providedIn: 'root'
})

export abstract class NoteService extends AChromeService {
  protected getTypeName(): string {
    return 'Note';
  }
}
