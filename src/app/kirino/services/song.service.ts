import {Injectable} from '@angular/core';
import {AChromeService} from '../../services/achrome.service';

@Injectable({
  providedIn: 'root'
})

export class SongService extends AChromeService {
  protected getTypeName(): string {
    return 'Song';
  }
}
