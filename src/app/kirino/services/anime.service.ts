import {Injectable} from '@angular/core';
import {AChromeService} from '../../services/achrome.service';

@Injectable({
  providedIn: 'root'
})

export class AnimeService extends AChromeService {
  protected getTypeName(): string {
    return 'Anime';
  }
}
