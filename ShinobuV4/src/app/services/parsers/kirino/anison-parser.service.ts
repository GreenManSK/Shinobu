import { Injectable } from '@angular/core';
import { ISiteParser } from './isite-parser';
import { Song } from '../../../data/kirino/Song';
import { HttpClientService } from '../../http-client.service';
import { ErrorService } from '../../error.service';
import { LogError } from '../../../types/LogError';
import { KirinoFormComponent } from '../../../components/kirino/kirino-form/kirino-form.component';
import { MusicFormComponent } from '../../../components/kirino/music-form/music-form.component';

@Injectable({
  providedIn: 'root'
})
export class AnisonParserService implements ISiteParser<Song> {

  private static readonly URL_REGEX = new RegExp(/^https?:\/\/anison\.info\/data\/song\/(\d+)\.html/, 'i');
  private static readonly URL_TEMPLATE = AnisonParserService.URL_REGEX.toString().replace(/(\/\^|\/i|\\|s\?)/g, '');

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
    return url.match(AnisonParserService.URL_REGEX) !== null;
  }

  private parseData( url: string, html: string ): Song {
    const song = new Song();

    try {
      song.anisonId = AnisonParserService.getId(url);

      const el = document.createElement('html');
      el.innerHTML = html;

      const showInfo = el.querySelectorAll('table.liest')[1].querySelector('tbody tr:nth-child(1)');
      song.show = showInfo?.querySelector('td:nth-child(2)')?.textContent || '';
      song.type = showInfo?.querySelector('td:nth-child(3)')?.textContent || '';

      song.title = el.querySelector('.subject')?.textContent || '';
      const authorHeader = Array.from(el.querySelectorAll('td')).filter(td => td?.textContent?.includes('歌手'));
      song.author = authorHeader.length > 0 && authorHeader[0]?.parentElement?.querySelector('td:nth-child(2)')?.textContent || '';
      const date = el.querySelector('[axis=date]')?.getAttribute('title');
      if (date) {
        song.releaseDate = (new Date(date)).getTime();
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

  public static getUrl( id: number ): string {
    return AnisonParserService.URL_TEMPLATE.replace('(d+)', id.toString());
  }

  public static getId( url: string ): number {
    const match = url.match(AnisonParserService.URL_REGEX);
    return match !== null && match[1] !== null ? +match[1] : 0;
  }
}
