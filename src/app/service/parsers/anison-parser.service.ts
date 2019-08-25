import { Injectable } from '@angular/core';
import { SiteParser } from './site-parser';
import { HttpClient } from '../../../../node_modules/@angular/common/http';
import { Song } from '../../kirino/types/song';
import * as $ from 'jquery';
import { KirinoFormComponent } from '../../kirino/components/kirino-form/kirino-form.component';
import { MusicFormComponent } from '../../kirino/components/music-form/music-form.component';

@Injectable({
  providedIn: 'root'
})
export class AnisonParserService implements SiteParser {

  private static readonly URL_REGEX = new RegExp(/^https?:\/\/anison\.info\/data\/song\/(\d+)\.html/, 'i');
  private static readonly URL_TEMPLATE = AnisonParserService.URL_REGEX.toString().replace(/(\/\^|\/i|\\|s\?)/g, '');

  constructor( private http: HttpClient ) {
  }

  public static getUrl( id: number ): string {
    return AnisonParserService.URL_TEMPLATE.replace('(d+)', id.toString());
  }

  public static getId( url: string ): number {
    const match = url.match(AnisonParserService.URL_REGEX);
    return match !== null ? +match[1] : null;
  }

  getData( url: string ): Promise<any> {
    return new Promise(( resolve, reject ) => {
      this.http.get(url, {responseType: 'text'}).subscribe(( html ) => {
        resolve(this.parseData(url, html));
      });
    });
  }

  private parseData( url: string, html: string ): Song {
    const song = new Song();
    song.anisonId = AnisonParserService.getId(url);

    const $site = $(html);
    const $showInfo = $($site.find('table.list').get(1)).find('tbody tr:nth-child(1)');
    song.show = $showInfo.find('td:nth-child(2)').text();
    song.type = $showInfo.find('td:nth-child(3)').text();

    song.title = $site.find('.subject').text();
    song.author = $site.find('td:contains(歌手)').parent('tr').find('td:nth-child(2)').text();
    const date = $site.find('[axis=date]').first().attr('title');
    if (date) {
      song.releaseDate = (new Date(date)).getTime();
    }

    return song;
  }

  getFormUrl( data: any ): string {
    const song = data as Song;
    return KirinoFormComponent.getUrl(MusicFormComponent.TYPE) + '?' +
      MusicFormComponent.SHOW_PARAM + '=' + encodeURIComponent(song.show) + '&' +
      MusicFormComponent.TYPE_PARAM + '=' + encodeURIComponent(song.type) + '&' +
      MusicFormComponent.TITLE_PARAM + '=' + encodeURIComponent(song.title) + '&' +
      MusicFormComponent.AUTHOR_PARAM + '=' + encodeURIComponent(song.author) + '&' +
      MusicFormComponent.DATE_PARAM + '=' + encodeURIComponent(song.releaseDate) + '&' +
      MusicFormComponent.ANIDB_ID_PARAM + '=' + encodeURIComponent(song.anidbId) + '&' +
      MusicFormComponent.ANISON_ID_PARAM + '=' + encodeURIComponent(song.anisonId) + '&';
  }

  match( url: string ): boolean {
    return url.match(AnisonParserService.URL_REGEX) !== null;
  }
}
