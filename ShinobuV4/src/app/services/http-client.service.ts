/// <reference types="chrome" />
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  private corsServerUrl: string;
  private useCorsServer: boolean;

  constructor( private http: HttpClient ) {
    this.corsServerUrl = environment.corsServer;
    this.useCorsServer = !!chrome;
  }

  public getData( url: string ): Promise<string> {
    return new Promise(( resolve ) => {
      let subscription: Subscription | undefined = undefined;
      subscription = this.http.get(this.getUrl(url), {responseType: 'text'}).subscribe(html => {
        resolve(html);
        subscription && subscription.unsubscribe();
      });
    });
  }

  private getUrl( plainUrl: string ) {
    return this.useCorsServer ? `${this.corsServerUrl}${plainUrl}` : plainUrl;
  }
}
