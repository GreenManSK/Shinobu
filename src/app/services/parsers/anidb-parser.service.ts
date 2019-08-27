import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnidbParserService {

  constructor() {
  }

  public static anidbDateToTimestamp( dateString: string ): number {
    const date = dateString.split('.');
    const dateObj = new Date();
    dateObj.setDate(+date[0]);
    dateObj.setMonth((+date[1]) - 1);
    dateObj.setFullYear(+date[2]);
    return dateObj.getTime();
  }
}
