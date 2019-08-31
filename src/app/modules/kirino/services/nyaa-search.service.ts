import { Injectable } from '@angular/core';
import { Anime } from '../types/anime';
import { Episode } from '../types/episode';
import { PreferenceService } from '../../settings/services/preference.service';

@Injectable({
  providedIn: 'root'
})
export class NyaaSearchService {

  private nyaaDomain = 'loading';

  constructor(preferenceService: PreferenceService) {
    preferenceService.get().then((preference) => {
      this.nyaaDomain = preference.kirino.nyaaUrl;
    });
  }

  public generateSearchText(anime: Anime, episode: Episode): string {
    let text = anime.nyaaSearch;
    text = this.normalize(text);
    text = this.replaceWildFlags(text, episode);
    return text;
  }

  public getSearchUrl(search: string): string {
    return this.nyaaDomain + '/?f=0&c=0_0&q=' + encodeURIComponent(search).replace(/%20/g, '+');
  }

  private normalize(text: string): string {
    text = text.replace(/%(n)/g, '%($1+0)');
    text = text.replace(/%\((n)\)/g, '%($1+0)');
    text = text.replace(/%\((.*?)\)(?!_1)/g, '%($1)_1');
    return text;
  }

  private replaceWildFlags(text: string, episode: Episode): string {
    return text.replace(/%\((n)([+-]\d+)\)_(10*)/g, (match, type, add, pad) => {
      let n = +episode.episodeNumber;
      n += +add;
      return this.pad(n.toString(), pad.length);
    });
  }

  private pad(n: string, length: any): string {
    return (n.length < length) ? this.pad('0' + n, length) : n;
  }
}
