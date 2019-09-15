import { Injectable } from '@angular/core';
import { SiteParser } from './site-parser';
import { KirinoFormComponent } from '../../modules/kirino/components/kirino-form/kirino-form.component';
import { Manga } from '../../modules/kirino/types/manga';
import { MangaFormComponent } from '../../modules/kirino/components/manga-form/manga-form.component';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from '../error.service';
import * as $ from 'jquery';
import { Episode } from '../../modules/kirino/types/episode';
import { LogError } from '../../types/log-error';

@Injectable({
  providedIn: 'root'
})
export class MangaParserService implements SiteParser {

  public static readonly PAGE_SIZE = 10;

  private static readonly URL_REGEX = new RegExp(/^https?:\/\/(?:www\.)?amazon(?:\.co)?\.jp\/gp\/product\/(.*)\?.*/, 'i');
  private static readonly URL_TEMPLATE = 'https://www.amazon.co.jp/gp/product/(d+)';

  private static readonly API_URL = 'https://www.amazon.co.jp/kindle-dbs/productPage/ajax/seriesAsinList?' +
    'asin=%aid&pageNumber=%apage&pageSize='
    + MangaParserService.PAGE_SIZE + '&ref_=series_dp_batch_load_more';

  constructor( private http: HttpClient, private errorService: ErrorService ) {
  }

  public static getUrl( id: string ): string {
    return MangaParserService.URL_TEMPLATE.replace('(d+)', id.toString());
  }

  public static getApiUrl( id: string, page: number ): string {
    return MangaParserService.API_URL.replace(/%aid/g, id).replace(/%apage/g, page.toString());
  }

  public getData( url: string ): Promise<any> {
    return new Promise(( resolve, reject ) => {
      this.http.get(url, {responseType: 'text'}).subscribe(( html ) => {
        resolve(this.parseData(url, html));
      });
    });
  }

  private parseData( url: string, html: string ): Manga {
    const manga = new Manga();

    try {
      const $site = $(html);
      const title = $site.find('title').get(0);
      if (title) {
        manga.title = $site.find(title).text();
        manga.amazonId = this.getId(url);
      } else {
        manga.title = $site.find('.itemBookTitle').first().text();
        const volumes = $site.find('.series-childAsin-count');
        for (const volume of volumes) {
          const volumeNumber = $(volume).text().trim();
          manga.episodes.push(new Episode(volumeNumber, Date.now()));
        }
      }
    } catch (e) {
      this.errorService.sendError(new LogError(
        this.constructor.name,
        e.message,
        Date.now(),
        e
      ));
    }

    return manga;
  }

  private getId( url: string ): string {
    const match = url.match(MangaParserService.URL_REGEX);
    return match !== null ? match[1] : null;
  }


  public getFormUrl( data: any ): string {
    const manga = data as Manga;
    return KirinoFormComponent.getUrl(MangaFormComponent.TYPE) + '?' +
      MangaFormComponent.TITLE_PARAM + '=' + encodeURIComponent(manga.title) + '&' +
      MangaFormComponent.AMAZON_ID_PARAM + '=' + encodeURIComponent(manga.amazonId);
  }

  match( url: string ): boolean {
    return url.match(MangaParserService.URL_REGEX) !== null;
  }


}
