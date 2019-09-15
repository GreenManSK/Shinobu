import { Injectable } from '@angular/core';
import { SiteParser } from './site-parser';
import { KirinoFormComponent } from '../../modules/kirino/components/kirino-form/kirino-form.component';
import { Manga } from '../../modules/kirino/types/manga';
import { MangaFormComponent } from '../../modules/kirino/components/manga-form/manga-form.component';

@Injectable({
  providedIn: 'root'
})
export class MangaParserService implements SiteParser {

  private static readonly URL_REGEX = new RegExp(/^https?:\/\/(?:www\.)?amazon(?:\.co)?\.jp\/gp\/product\/(.*)\?.*/, 'i');
  private static readonly URL_TEMPLATE = 'https://www.amazon.co.jp/gp/product/(d+)';

  constructor() {
  }

  public static getUrl( id: string ): string {
    return MangaParserService.URL_TEMPLATE.replace('(d+)', id.toString());
  }

  getData( url: string ): Promise<any> {
    return undefined;
  }

  getFormUrl( data: any ): string {
    const manga = data as Manga;
    return KirinoFormComponent.getUrl(MangaFormComponent.TYPE) + '?' +
      MangaFormComponent.TITLE_PARAM + '=' + encodeURIComponent(manga.title) + '&' +
      MangaFormComponent.AMAZON_ID_PARAM + '=' + encodeURIComponent(manga.amazonId);
  }

  match( url: string ): boolean {
    return false;
  }


}
