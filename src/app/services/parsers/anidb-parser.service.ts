import { Injectable } from '@angular/core';
import { SiteParser } from './site-parser';
import { Anime } from '../../modules/kirino/types/anime';
import { AnimeFormComponent } from '../../modules/kirino/components/anime-form/anime-form.component';
import { KirinoFormComponent } from '../../modules/kirino/components/kirino-form/kirino-form.component';
import { HttpClient } from '@angular/common/http';
import * as $ from 'jquery';
import { Episode } from '../../modules/kirino/types/episode';
import { ErrorService } from '../error.service';
import { LogError } from '../../types/log-error';

@Injectable({
  providedIn: 'root'
})
export class AnidbParserService implements SiteParser {

  private static readonly URL_REGEX = new RegExp(/^https?:\/\/anidb\.net\/anime\/(\d+)/, 'i');
  private static readonly URL_TEMPLATE = AnidbParserService.toString().replace(/(\/\^|\/i|\\|s\?)/g, '');

  private static readonly HTTP_API =
    'http://api.anidb.net:9001/httpapi?request=anime&client=%httpClient&clientver=%clientver&protover=1&aid=%aid';
  private static readonly CLIENT_VER = '4';
  private static readonly HTTP_CLIENT = 'shinobu';
  private static readonly API_URL = AnidbParserService.HTTP_API
    .replace(/%httpClient/g, AnidbParserService.HTTP_CLIENT)
    .replace(/%clientver/g, AnidbParserService.CLIENT_VER);

  constructor( private http: HttpClient, private errorService: ErrorService ) {
  }

  public static getUrl( id: number ): string {
    return AnidbParserService.URL_TEMPLATE.replace('(d+)', id.toString());
  }

  public static getApiUrl( id: number ): string {
    return AnidbParserService.API_URL.replace(/%aid/g, id.toString());
  }

  public static anidbDateToTimestamp( dateString: string ): number {
    if (!dateString) {
      return null;
    }
    const date = dateString.split('.');
    if (date.length !== 3) {
      return null;
    }
    const dateObj = new Date();
    dateObj.setDate(+date[0]);
    dateObj.setMonth((+date[1]) - 1);
    dateObj.setFullYear(+date[2]);
    return dateObj.getTime();
  }

  public getData( url: string ): Promise<any> {
    if (this.match(url)) {
      const id = this.getId(url);
      url = AnidbParserService.getApiUrl(id);
    }
    return new Promise(( resolve, reject ) => {
      this.http.get(url, {responseType: 'text'}).subscribe(( html ) => {
        resolve(this.parseData(url, html));
      });
    });
  }

  private getId( url: string ): number {
    const match = url.match(AnidbParserService.URL_REGEX);
    return match !== null ? +match[1] : null;
  }

  private parseData( url: string, html: string ): Anime {
    const anime = new Anime();

    try {
      const $site = $(html);
      anime.anidbId = +$site.get(1).id;
      anime.title = $site.find('title[type=main]').text();

      const episodes = $site.find('episode').toArray();
      for (const episode of episodes) {
        const $ep = $(episode);
        const airdate = $ep.find('airdate').text();
        const num = +$ep.find('epno[type=1]').text();
        if (num > 0 && !isNaN(num)) {
          anime.episodes.push(new Episode(
            num.toString(),
            airdate ? new Date(airdate).getTime() : null
          ));
        }
      }
      anime.episodes.sort(( a, b ) => (a.airdate - b.airdate));
    } catch (e) {
      this.errorService.sendError(new LogError(
        this.constructor.name,
        e.message,
        Date.now(),
        e
      ));
    }

    return anime;
  }

  public getFormUrl( data: any ): string {
    const anime = data as Anime;
    return KirinoFormComponent.getUrl(AnimeFormComponent.TYPE) + '?' +
      AnimeFormComponent.TITLE_PARAM + '=' + encodeURIComponent(anime.title) + '&' +
      AnimeFormComponent.ANIDB_ID_PARAM + '=' + encodeURIComponent(anime.anidbId);
  }

  public match( url: string ): boolean {
    return url.match(AnidbParserService.URL_REGEX) !== null;
  }
}
