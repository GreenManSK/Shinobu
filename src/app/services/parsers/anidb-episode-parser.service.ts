import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SiteParser} from './site-parser';
import {Ova} from '../../modules/kirino/types/ova';
import {KirinoFormComponent} from '../../modules/kirino/components/kirino-form/kirino-form.component';
import {OvaFormComponent} from '../../modules/kirino/components/ova-form/ova-form.component';
import * as $ from 'jquery';
import {AnidbParserService} from './anidb-parser.service';

@Injectable({
  providedIn: 'root'
})
export class AnidbEpisodeParserService implements SiteParser {

  private static readonly URL_REGEX = new RegExp(/^https?:\/\/anidb\.net\/episode\/(\d+)/, 'i');
  private static readonly URL_TEMPLATE = AnidbEpisodeParserService.URL_REGEX.toString().replace(/(\/\^|\/i|\\|s\?)/g, '');

  constructor(private http: HttpClient) {
  }

  public static getUrl(id: number): string {
    return AnidbEpisodeParserService.URL_TEMPLATE.replace('(d+)', id.toString());
  }

  public static getId(url: string): number {
    const match = url.match(AnidbEpisodeParserService.URL_REGEX);
    return match !== null ? +match[1] : null;
  }

  getData(url: string): Promise<any> {
    return new Promise(( resolve, reject ) => {
      this.http.get(url, {responseType: 'text'}).subscribe(( html ) => {
        resolve(this.parseData(url, html));
      });
    });
  }

  private parseData( url: string, html: string ): Ova {
    const ova = new Ova();
    ova.anidbId = AnidbEpisodeParserService.getId(url);

    const $site = $(html);
    ova.title = $site.find('h1').text().replace('Episode: ', '');
    ova.airdate = AnidbParserService.anidbDateToTimestamp($site.find('#tab_1_pane .date td').text());

    return ova;
  }

  getFormUrl(data: any): string {
    const ova = data as Ova;
    return KirinoFormComponent.getUrl(OvaFormComponent.TYPE) + '?' +
      OvaFormComponent.TITLE_PARAM + '=' + encodeURIComponent(ova.title) + '&' +
      OvaFormComponent.ANIDB_ID_PARAM + '=' + encodeURIComponent(ova.anidbId) + '&' +
      OvaFormComponent.DATE_PARAM + '=' + encodeURIComponent(ova.airdate);
  }

  match(url: string): boolean {
    return url.match(AnidbEpisodeParserService.URL_REGEX) !== null;
  }
}
