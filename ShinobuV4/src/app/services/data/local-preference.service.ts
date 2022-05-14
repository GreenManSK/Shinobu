import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalPreferenceService {
  constructor() {
  }

  public get( key: string, defaultValue: any ): any {
    const storedValue = localStorage.getItem(key);
    if (!storedValue) {
      return defaultValue;
    }
    return JSON.parse(storedValue);
  }

  public set( key: string, value: any ): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
