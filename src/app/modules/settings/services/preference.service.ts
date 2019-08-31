import { Injectable } from '@angular/core';
import { StoragePromiseService } from '../../../services/storage-promise.service';
import { ChromeMockStorageService } from '../../../mocks/chrome-mock-storage.service';
import { ErrorService } from '../../../services/error.service';
import { Preference } from '../types/preference';

@Injectable({
  providedIn: 'root'
})
export class PreferenceService extends StoragePromiseService {

  private static readonly STORAGE_KEY = 'Preferences';

  constructor(
    chromeStorage: ChromeMockStorageService,
    protected errorService: ErrorService
  ) {
    super(chromeStorage, errorService);
    // super(chrome.storage.sync, errorService); TODO: Fix
  }

  public get(): Promise<Preference> {
    return this.storageGetOne(PreferenceService.STORAGE_KEY).then(( result ) => {
      if (result) {
        return result;
      }
      return {
        kirino: {
          enableAutoSync: false,
          anidbRefreshRateInMin: 2 * 60,
          anisonRefreshRateInMin: 12 * 60,
          theTvdbRefreshRateInMin: 6 * 60
        }
      };
    });
  }

  public set( preference: Preference ): Promise<void> {
    const data = {};
    data[PreferenceService.STORAGE_KEY] = preference;
    return this.storageSet(data);
  }
}
