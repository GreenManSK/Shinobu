import { Injectable } from '@angular/core';
import { ISiteParser } from './isite-parser';
import { Ova } from '../../../data/kirino/Ova';
import { HttpClientService } from '../../http-client.service';
import { ErrorService } from '../../error.service';
import { LogError } from '../../../types/LogError';
import { AnidbParserService } from './anidb-parser.service';
import { KirinoFormComponent } from '../../../components/kirino/kirino-form/kirino-form.component';
import { OvaFormComponent } from '../../../components/kirino/ova-form/ova-form.component';

@Injectable({
  providedIn: 'root'
})
export class AnidbEpisodeParserService implements ISiteParser<Ova> {

  private static readonly URL_REGEX = new RegExp(/^https?:\/\/anidb\.net\/episode\/(\d+)/, 'i');
  private static readonly URL_TEMPLATE = AnidbEpisodeParserService.URL_REGEX.toString().replace(/(\/\^|\/i|\\|s\?)/g, '');

  constructor( private http: HttpClientService, private errorService: ErrorService ) {
  }

  public getData( url: string ): Promise<Ova> {
    return this.http.getData(url).then(( html ) => this.parseData(url, html));
  }

  public getFormUrl( ova: Ova ): string {
    return KirinoFormComponent.getUrl(OvaFormComponent.TYPE) + '?' +
      OvaFormComponent.TITLE_PARAM + '=' + encodeURIComponent(ova.title) + '&' +
      OvaFormComponent.ANIDB_ID_PARAM + '=' + encodeURIComponent(ova.anidbId) + '&' +
      OvaFormComponent.DATE_PARAM + '=' + encodeURIComponent(ova.airdate);
  }

  public match( url: string ): boolean {
    return url.match(AnidbEpisodeParserService.URL_REGEX) !== null;
  }

  public static getUrl( id: number ): string {
    return AnidbEpisodeParserService.URL_TEMPLATE.replace('(d+)', id.toString());
  }

  public static getId( url: string ): number {
    const match = url.match(AnidbEpisodeParserService.URL_REGEX);
    return match !== null && match[1] !== null ? +match[1] : 0;
  }

  private parseData( url: string, html: string ): Ova {
    const ova = new Ova();
    try {
      ova.anidbId = AnidbEpisodeParserService.getId(url);

      const el = document.createElement('html');
      el.innerHTML = html;

      ova.title = el.querySelector('h1')?.textContent?.replace('Episode: ', '') || '';
      ova.airdate = AnidbParserService.anidbDateToTimestamp(el.querySelector('#tab_1_pane .date td')?.textContent || '') || 0;
    } catch (e: any) {
      this.errorService.sendError(new LogError(
        this.constructor.name,
        e?.message || 'Unknown error',
        e
      ));
    }
    return ova;
  }
}
