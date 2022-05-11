import { Injectable } from '@angular/core';
import { ISiteParser } from './isite-parser';
import { Song } from '../../../data/kirino/Song';
import { HttpClientService } from '../../http-client.service';
import { ErrorService } from '../../error.service';
import { LogError } from '../../../types/LogError';
import { AnidbParserService } from './anidb-parser.service';
import { AnisonParserService } from './anison-parser.service';

@Injectable({
  providedIn: 'root'
})
export class AnidbSongParserService implements ISiteParser<Song> {

  private static readonly URL_REGEX = new RegExp(/^https?:\/\/anidb\.net\/song\/(\d+)/, 'i');
  private static readonly URL_TEMPLATE = AnidbSongParserService.URL_REGEX.toString().replace(/(\/\^|\/i|\\|s\?)/g, '');

  constructor( private http: HttpClientService, private errorService: ErrorService ) {
  }

  public getData( url: string ): Promise<Song> {
    return this.http.getData(url).then(( html ) => this.parseData(url, html));
  }

  public getFormUrl( data: Song ): string {
    // TODO: add when song form implemented
    return '';
  }

  public match( url: string ): boolean {
    return url.match(AnidbSongParserService.URL_REGEX) !== null;
  }

  public static getUrl( id: number ): string {
    return AnidbSongParserService.URL_TEMPLATE.toString().replace('(d+)', id.toString());
  }

  public static getId( url: string ): number {
    const match = url.match(AnidbSongParserService.URL_REGEX);
    return match !== null && match[1] !== null ? +match[1] : 0;
  }


  private parseData( url: string, html: string ) {
    const song = new Song();

    try {
      song.anidbId = AnidbSongParserService.getId(url);

      const el = document.createElement('html');
      el.innerHTML = html;

      song.show = el.querySelector('.name')?.textContent || '';
      song.type = el.querySelector('td:first-child')?.textContent || '';
      const titleHeader = Array.from(el.querySelectorAll('th')).filter(th => th?.textContent?.includes('Main Title'));
      song.title = titleHeader.length > 0 && titleHeader[0].querySelector('.value span')?.textContent || '';
      song.author = el.querySelector('.creators .value')?.textContent || '';

      const relase = el.querySelector('#collectionlist tbody .released')?.textContent;
      if (relase) {
        song.releaseDate = AnidbParserService.anidbDateToTimestamp(relase) || 0;
      }

      const anisonUrl = el.querySelector('.i_resource_anison')?.getAttribute('href');
      if (anisonUrl) {
        song.anisonId = AnisonParserService.getId(anisonUrl);
      }
    } catch (e: any) {
      this.errorService.sendError(new LogError(
        this.constructor.name,
        e?.message || 'Unknown error',
        e
      ));
    }

    return song;
  }
}
