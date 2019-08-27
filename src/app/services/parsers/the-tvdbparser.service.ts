import { Injectable } from '@angular/core';
import { SiteParser } from './site-parser';
import { HttpClient } from '@angular/common/http';
import { Show } from '../../modules/kirino/types/show';
import * as $ from 'jquery';
import { Episode } from '../../modules/kirino/types/episode';
import { KirinoFormComponent } from '../../modules/kirino/components/kirino-form/kirino-form.component';
import { ShowFormComponent } from '../../modules/kirino/components/show-form/show-form.component';

@Injectable({
  providedIn: 'root'
})
export class TheTVDBParserService implements SiteParser {

  private static readonly URL_REGEX = new RegExp(/^https?:\/\/(?:www\.)?thetvdb\.com\/series\/([^/]+)\/seasons\/all/, 'i');
  private static readonly URL_TEMPLATE = TheTVDBParserService.URL_REGEX.toString()
    .replace(/\(\?:www\\\.\)\?/g, 'www.').replace(/(\/\^|\/i|\\|s\?)/g, '');

  constructor( private http: HttpClient ) {
  }

  public static getUrl( id: string ): string {
    return TheTVDBParserService.URL_TEMPLATE.replace('([^/]+)', id);
  }

  public static getId( url: string ): string {
    const match = url.match(TheTVDBParserService.URL_REGEX);
    return match !== null ? match[1] : null;
  }

  getData( url: string ): Promise<any> {
    return new Promise(( resolve, reject ) => {
      this.http.get(url, {responseType: 'text'}).subscribe(( html ) => {
        resolve(this.parseData(url, html));
      });
    });
  }

  private parseData( url: string, html: string ): Show {
    const show = new Show();
    show.tvdbId = TheTVDBParserService.getId(url);

    const $site = $(html);
    show.title = $site.find('h2 a').first().text().trim();

    const episodes = $site.find('table[id=translations] tbody tr').toArray();
    for (const episode of episodes) {
      const $ep = $(episode);
      const airdate = $ep.find('td:nth-child(3)').text().trim();
      const seasonTitle = $ep.parents('table').prev().text();
      const seasonNumber = seasonTitle.match(/(\d+)$/g);
      if (seasonNumber === null) {
        continue;
      }
      const epNum = $ep.find('td:nth-child(1)').text().trim();
      show.episodes.push(new Episode(
        (seasonNumber.length > 0 ? seasonNumber[0] : 0) + 'x' + epNum,
        airdate ? new Date(airdate).getTime() : null
      ));
    }
    show.episodes.sort(( a, b ) => (a.airdate - b.airdate));

    return show;
  }

  getFormUrl( data: any ): string {
    const show = data as Show;
    return KirinoFormComponent.getUrl(ShowFormComponent.TYPE) + '?' +
      ShowFormComponent.TITLE_PARAM + '=' + encodeURIComponent(show.title) + '&' +
      ShowFormComponent.TVDB_ID_PARAM + '=' + encodeURIComponent(show.tvdbId);
  }

  match( url: string ): boolean {
    return url.match(TheTVDBParserService.URL_REGEX) !== null;
  }
}
