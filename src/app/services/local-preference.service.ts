import { Injectable } from '@angular/core';
import { StoragePromiseService } from './storage-promise.service';
import { ErrorService } from './error.service';
import { ChromeStorageProviderService } from './chrome-storage-provider.service';

@Injectable({
  providedIn: 'root'
})
export class LocalPreferenceService extends StoragePromiseService {

  constructor(
    chromeStorageProvider: ChromeStorageProviderService,
    errorService: ErrorService ) {
    super(chromeStorageProvider.getLocal(), errorService);
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
