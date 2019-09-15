import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MangaSyncService {

  private static readonly SYNC_TIME_KEY = 'LAST_MANGA_SYNC';
  private static readonly DELAY = 24 * 60 * 1000;

  constructor() {
  }
}
