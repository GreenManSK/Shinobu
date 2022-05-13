import { Injectable } from '@angular/core';
import { ISiteParser } from './isite-parser';
import { Show } from '../../../data/kirino/Show';
import { HttpClientService } from '../../http-client.service';
import { ErrorService } from '../../error.service';
import { LogError } from '../../../types/LogError';
import { Episode } from '../../../data/kirino/Episode';
import { ShowFormComponent } from '../../../components/kirino/show-form/show-form.component';
import { KirinoFormComponent } from '../../../components/kirino/kirino-form/kirino-form.component';

@Injectable({
  providedIn: 'root'
})
export class TheTVDBParserService implements ISiteParser<Show> {

  private static readonly URL_REGEX = new RegExp(/^https?:\/\/(?:www\.)?thetvdb\.com\/series\/([^/]+)\/allseasons\/official/, 'i');
  private static readonly URL_TEMPLATE = TheTVDBParserService.URL_REGEX.toString()
    .replace(/\(\?:www\\\.\)\?/g, 'www.').replace(/(\/\^|\/i|\\|s\?)/g, '');

  constructor( private http: HttpClientService, private errorService: ErrorService ) {
  }

  public getData( url: string ): Promise<Show> {
    return this.http.getData(url).then(( html ) => this.parseData(url, html));
  }

  public getFormUrl( show: Show ): string {
    return KirinoFormComponent.getUrl(ShowFormComponent.TYPE) + '?' +
      ShowFormComponent.TITLE_PARAM + '=' + encodeURIComponent(show.title) + '&' +
      ShowFormComponent.TVDB_ID_PARAM + '=' + encodeURIComponent(show.tvdbId);
  }

  public match( url: string ): boolean {
    return url.match(TheTVDBParserService.URL_REGEX) !== null;
  }

  public static getUrl( id: string ): string {
    return TheTVDBParserService.URL_TEMPLATE.replace('([^/]+)', id);
  }

  public static getId( url: string ): string {
    const match = url.match(TheTVDBParserService.URL_REGEX);
    return match !== null && match[1] !== null ? match[1] : '';
  }

  private parseData( url: string, html: string ): Show {
    const show = new Show();

    try {
      show.tvdbId = TheTVDBParserService.getId(url);

      const el = document.createElement('html');
      el.innerHTML = html;

      show.title = el.querySelector('title')?.textContent?.trim() || '';
      el.querySelectorAll('.list-group li.list-group-item').forEach(episode => {
        const airdate = episode.querySelector('ul li')?.textContent?.trim() || '';
        const number = episode.querySelector('h4 span')?.textContent?.trim() || '';
        show.episodes.push(new Episode(number, airdate ? new Date(airdate).getTime() : 0));
      });
      show.episodes.sort(( a, b ) => (a.airdate - b.airdate));
    } catch (e: any) {
      this.errorService.sendError(new LogError(
        this.constructor.name,
        e?.message || 'Unknown error',
        e
      ));
    }

    return show;
  }
}
