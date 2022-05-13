import { Injectable } from '@angular/core';
import { ISiteParser } from './isite-parser';
import { Manga } from '../../../data/kirino/Manga';
import { HttpClientService } from '../../http-client.service';
import { ErrorService } from '../../error.service';
import { LogError } from '../../../types/LogError';
import { Episode } from '../../../data/kirino/Episode';
import { MangaFormComponent } from '../../../components/kirino/manga-form/manga-form.component';
import { KirinoFormComponent } from '../../../components/kirino/kirino-form/kirino-form.component';

@Injectable({
  providedIn: 'root'
})
export class MangaParserService implements ISiteParser<Manga> {

  public static readonly PAGE_SIZE = 10;

  private static readonly URL_REGEX = new RegExp(/^https?:\/\/(?:www\.)?amazon(?:\.co)?\.jp\/gp\/product\/(.*)\?.*/, 'i');
  private static readonly URL_TEMPLATE = 'https://www.amazon.co.jp/gp/product/(d+)';

  private static readonly API_URL = `https://www.amazon.co.jp/kindle-dbs/productPage/ajax/seriesAsinList?asin=%aid&pageNumber=%apage&pageSize=${MangaParserService.PAGE_SIZE}&ref_=series_dp_batch_load_more`

  constructor( private http: HttpClientService, private errorService: ErrorService ) {
  }

  public getData( url: string ): Promise<Manga> {
    return this.http.getData(url).then(( html ) => this.parseData(url, html));
  }

  public getFormUrl( manga: Manga ): string {
    return KirinoFormComponent.getUrl(MangaFormComponent.TYPE) + '?' +
      MangaFormComponent.TITLE_PARAM + '=' + encodeURIComponent(manga.title) + '&' +
      MangaFormComponent.AMAZON_ID_PARAM + '=' + encodeURIComponent(manga.amazonId);
  }

  public match( url: string ): boolean {
    return url.match(MangaParserService.URL_REGEX) !== null;
  }

  public static getUrl( id: string ): string {
    return MangaParserService.URL_TEMPLATE.replace('(d+)', id.toString());
  }

  public static getApiUrl( id: string, page: number ): string {
    return MangaParserService.API_URL.replace(/%aid/g, id).replace(/%apage/g, page.toString());
  }

  private parseData( url: string, html: string ): Manga {
    const manga = new Manga();

    try {
      const el = document.createElement('html');
      el.innerHTML = html;

      const title = el.querySelector('title');
      if (title) {
        manga.title = title.textContent || '';
        manga.amazonId = this.getId(url);
      } else {
        manga.title = el.querySelector('.itemBookTitle')?.textContent || '';
        const volumes = el.querySelectorAll('.series-childAsin-count');
        volumes.forEach(volume => {
          const volumeNumber = volume?.textContent?.trim() || '-1';
          manga.episodes.push(new Episode(volumeNumber, Date.now()));
        });
      }
    } catch (e: any) {
      this.errorService.sendError(new LogError(
        this.constructor.name,
        e?.message || 'Unknown error',
        e
      ));
    }

    return manga;
  }

  private getId( url: string ): string {
    const match = url.match(MangaParserService.URL_REGEX);
    return match !== null && match[1] !== null ? match[1] : '';
  }
}
