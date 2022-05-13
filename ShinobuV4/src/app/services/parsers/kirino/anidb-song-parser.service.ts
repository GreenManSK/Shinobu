import { Injectable } from '@angular/core';
import { ISiteParser } from './isite-parser';
import { Song } from '../../../data/kirino/Song';
import { HttpClientService } from '../../http-client.service';
import { ErrorService } from '../../error.service';
import { LogError } from '../../../types/LogError';
import { AnidbParserService } from './anidb-parser.service';
import { AnisonParserService } from './anison-parser.service';
import { KirinoFormComponent } from '../../../components/kirino/kirino-form/kirino-form.component';
import { MusicFormComponent } from '../../../components/kirino/music-form/music-form.component';

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

  public getFormUrl( song: Song ): string {
    return KirinoFormComponent.getUrl(MusicFormComponent.TYPE) + '?' +
      MusicFormComponent.SHOW_PARAM + '=' + encodeURIComponent(song.show) + '&' +
      MusicFormComponent.TYPE_PARAM + '=' + encodeURIComponent(song.type) + '&' +
      MusicFormComponent.TITLE_PARAM + '=' + encodeURIComponent(song.title) + '&' +
      MusicFormComponent.AUTHOR_PARAM + '=' + encodeURIComponent(song.author) + '&' +
      MusicFormComponent.DATE_PARAM + '=' + encodeURIComponent(song.releaseDate) + '&' +
      MusicFormComponent.ANIDB_ID_PARAM + '=' + encodeURIComponent(song.anidbId) + '&' +
      MusicFormComponent.ANISON_ID_PARAM + '=' + encodeURIComponent(song.anisonId) + '&';
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
