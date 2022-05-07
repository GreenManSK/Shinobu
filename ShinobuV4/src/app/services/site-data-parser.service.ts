import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SiteDataParserService {

  private static readonly REQUEST_TIMEOUT_IN_S = 15;

  constructor() { }

  public getFaviconUrl(url: string): Promise<string | undefined> {
    const faviconUrl = this.prepareFaviconUrl(url);
    return new Promise<string | undefined>((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.timeout = SiteDataParserService.REQUEST_TIMEOUT_IN_S * 1000;
      request.open('GET', faviconUrl);
      request.onreadystatechange = function () {
        if (this.readyState === 4) {
          if (this.status === 200) {
            resolve(faviconUrl);
          } else {
            resolve(undefined);
          }
        }
      };
      request.onerror = () => reject();
      request.send();
    });
  }

  private prepareFaviconUrl(url: string): string {
    if (location.protocol === 'https:') {
      url = url.replace(/^https:?/, "");
      url = `${location.protocol}${url}`;
    }
    url = url.replace(/\/$/, "");
    return `${url}/favicon.ico`;
  }
}
