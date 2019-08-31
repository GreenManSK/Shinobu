import { Injectable } from '@angular/core';
import { ChromeMockStorageService } from '../mocks/chrome-mock-storage.service';
import StorageArea = chrome.storage.StorageArea;

@Injectable({
  providedIn: 'root'
})
export class ChromeStorageProviderService {

  private local: StorageArea;
  private snyc: StorageArea;

  constructor() {
    this.local = chrome && chrome.storage && chrome.storage.local ? chrome.storage.local : new ChromeMockStorageService();
    this.snyc = chrome && chrome.storage && chrome.storage.sync ? chrome.storage.sync : new ChromeMockStorageService();
  }

  public getSync(): StorageArea {
    return this.snyc;
  }

  public getLocal(): StorageArea {
    return this.local;
  }
}
