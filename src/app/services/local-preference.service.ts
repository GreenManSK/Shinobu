import { Injectable } from '@angular/core';
import { StoragePromiseService } from './storage-promise.service';
import { ChromeMockStorageService } from '../mocks/chrome-mock-storage.service';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class LocalPreferenceService extends StoragePromiseService {

  constructor(
    chromeStorage: ChromeMockStorageService,
    errorService: ErrorService ) {
    super(chromeStorage, errorService);
    // super(chrome.storage.local); TODO: Fix
  }

  public get( key: string, defaultValue: any ): Promise<any> {
    return this.storageGetOne(key).then(value => {
      return value ? value : defaultValue;
    });
  }

  public set( key: string, value: any ): Promise<void> {
    const data = {};
    data[key] = value;
    return this.storageSet(data);
  }
}
