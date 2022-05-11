import { Injectable } from '@angular/core';
import { ISiteParser } from './isite-parser';
import { Anime } from '../../../data/kirino/Anime';
import { ErrorService } from '../../error.service';
import { environment } from '../../../../environments/environment';
import { HttpClientService } from '../../http-client.service';
import { LogError } from '../../../types/LogError';
import { Episode } from '../../../data/kirino/Episode';

@Injectable({
  providedIn: 'root'
})
export class AnidbParserService implements ISiteParser<Anime> {

  private static readonly URL_REGEX = new RegExp(/^https?:\/\/anidb\.net\/anime\/(\d+)/, 'i');
  private static readonly URL_TEMPLATE = AnidbParserService.URL_REGEX.toString().replace(/(\/\^|\/i|\\|s\?)/g, '');
  private static readonly API_URL = `${environment.anidbApi.url}/httpapi?request=anime&client=${environment.anidbApi.clientName}&clientver=${environment.anidbApi.clientVersion}&protover=1&aid=`;

  constructor( private http: HttpClientService, private errorService: ErrorService ) {
  }

  public getData( url: string ): Promise<Anime> {
    if (this.match(url)) {
      const id = this.getId(url);
      if (id === undefined) {
        return Promise.reject();
      }
      url = AnidbParserService.getApiUrl(id);
    }
    return this.http.getData(url).then(( html ) => this.parseData(url, html));
  }

  public getFormUrl( data: Anime ): string {
    // TODO: when kirino form is added
    return '';
  }

  public match( url: string ): boolean {
    return url.match(AnidbParserService.URL_REGEX) !== null;
  }

  private getId( url: string ): number | undefined {
    const match = url.match(AnidbParserService.URL_REGEX);
    return match !== null ? +match[1] : undefined;
  }

  private parseData( url: string, html: string ): Anime {
    const anime = new Anime();

    try {
      const el = document.createElement('html');
      el.innerHTML = html;

      anime.title = el.querySelector('title[type=main]')?.textContent || '';
      el.querySelectorAll('episode').forEach(episode => {
        const airdate = episode.querySelector('airdate')?.textContent;
        const number = +(episode.querySelector('epno[type=1]')?.textContent || '');
        if (number > 0 && !isNaN(number)) {
          anime.episodes.push(new Episode(number.toString(), airdate ? new Date(airdate).getTime() : 0))
        }
      });
    } catch (e: any) {
      this.errorService.sendError(new LogError(
        this.constructor.name,
        e?.message || 'Unknown error',
        e
      ));
    }

    return anime;
  }

  public static getApiUrl( id: number ): string {
    return `${AnidbParserService.API_URL}${id}`;
  }

  public static getUrl( id: number ): string {
    return AnidbParserService.URL_TEMPLATE.replace('(d+)', id.toString());
  }

  public static anidbDateToTimestamp( dateString: string ): number | undefined {
    if (!dateString) {
      return undefined;
    }
    const date = dateString.split('.');
    if (date.length !== 3) {
      return undefined;
    }
    const dateObj = new Date();
    dateObj.setDate(+date[0]);
    dateObj.setMonth((+date[1]) - 1);
    dateObj.setFullYear(+date[2]);
    return dateObj.getTime();
  }
}
