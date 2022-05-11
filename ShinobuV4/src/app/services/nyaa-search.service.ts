import { Injectable } from '@angular/core';
import { KirinoSettingsService } from './data/kirino/kirino-settings.service';
import { Episode } from '../data/kirino/Episode';
import { Anime } from '../data/kirino/Anime';
import { NyaaSearch } from '../data/kirino/NyaaSearch';

@Injectable({
  providedIn: 'root'
})
export class NyaaSearchService {

  private nyaaUrl: string = '';

  constructor( kirinoSettings: KirinoSettingsService ) {
    kirinoSettings.subscribe().subscribe(settings => this.nyaaUrl = settings.nyaaUrl);
  }

  public generateSearchText( anime: Anime, episode: Episode ): string {
    if (!anime.nyaaSearch) {
      return '';
    }
    return `${anime.nyaaSearch.searchText} ${this.generateEpisodeNumber(anime.nyaaSearch, episode.number)}`;
  }

  public getSearchUrl( search: string ): string {
    return this.nyaaUrl + '/?f=0&c=0_0&q=' + encodeURIComponent(search).replace(/%20/g, '+');
  }

  private generateEpisodeNumber( nyaaSearch: NyaaSearch, number: string ) {
    return this.pad(number, nyaaSearch.digits);
  }

  private pad( n: string, length: any ): string {
    return (n.length < length) ? this.pad('0' + n, length) : n;
  }
}
