import { Injectable } from '@angular/core';
import { SiteParser } from './site-parser';
import { KirinoFormComponent } from '../../modules/kirino/components/kirino-form/kirino-form.component';
import { MusicFormComponent } from '../../modules/kirino/components/music-form/music-form.component';
import * as $ from 'jquery';
import { HttpClient } from '@angular/common/http';
import { Song } from '../../modules/kirino/types/song';
import { AnisonParserService } from './anison-parser.service';
import { AnidbParserService } from './anidb-parser.service';
import { ErrorService } from '../error.service';
import { LogError } from '../../types/log-error';

@Injectable({
  providedIn: 'root'
})
export class AnidbSongParserService implements SiteParser {

  private static readonly URL_REGEX = new RegExp(/^https?:\/\/anidb\.net\/song\/(\d+)/, 'i');

  constructor( private http: HttpClient, private errorService: ErrorService ) {
  }

  public static getUrl( id: number ): string {
    return AnidbSongParserService.URL_REGEX.toString().replace('(d+)', id.toString());
  }

  public static getId( url: string ): number {
    const match = url.match(AnidbSongParserService.URL_REGEX);
    return match !== null ? +match[1] : null;
  }

  public getData( url: string ): Promise<any> {
    return new Promise(( resolve, reject ) => {
      this.http.get(url, {responseType: 'text'}).subscribe(( html ) => {
        resolve(this.parseData(url, html));
      });
    });
  }

  private parseData( url: string, html: string ): Song {
    const song = new Song();
    try {
      song.anidbId = AnidbSongParserService.getId(url);

      const $site = $(html);

      const $anime = $site.find('#animelist tbody tr:first-child');

      song.show = $anime.find('.name').text();
      song.type = $anime.find('td:first-child').text();
      song.title = $site.find(':contains(\'Main Title\')').parent('tr').find('.value span').text();
      song.author = $site.find('.creators .value').text();

      const $releases = $site.find('#collectionlist tbody .released');
      if ($releases.length > 0) {
        song.releaseDate = AnidbParserService.anidbDateToTimestamp($releases.first().text());
      }

      const anisonUrl = $site.find('.anison').attr('href');
      if (anisonUrl) {
        song.anisonId = AnisonParserService.getId(anisonUrl);
      }
    } catch (e) {
      this.errorService.sendError(new LogError(
        this.constructor.name,
        e.message,
        Date.now(),
        e
      ));
    }

    return song;
  }

  public getFormUrl( data: any ): string {
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

  public match( url: string ): boolean {
    return url.match(AnidbSongParserService.URL_REGEX) !== null;
  }
}
