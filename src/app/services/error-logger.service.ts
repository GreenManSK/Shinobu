import { Injectable } from '@angular/core';
import { ErrorService } from './error.service';
import { StoragePromiseService } from './storage-promise.service';
import { ChromeMockStorageService } from '../mocks/chrome-mock-storage.service';
import { LogError } from '../types/log-error';

@Injectable({
  providedIn: 'root'
})
export class ErrorLoggerService extends StoragePromiseService {

  private static readonly STORAGE_KEY = 'ErrorsLog';

  constructor(
    private errorService: ErrorService,
    chromeStorage: ChromeMockStorageService
  ) {
    super(chromeStorage);
    // super(chrome.storage.local); TODO: Fix
  }

  public start(): void {
    this.errorService.addListener(this.onError.bind(this));
  }

  public getAll(): Promise<LogError[]> {
    return this.storageGet(ErrorLoggerService.STORAGE_KEY).then(( result ) => {
      if (!result) {
        return [];
      }
      return result;
    });
  }

  public clear(): Promise<void> {
    return this.storageRemove(ErrorLoggerService.STORAGE_KEY);
  }

  private onError( error: LogError ): void {
    this.getAll().then(( errors: LogError[] ) => {
      errors.push(error);
      const data = {};
      data[ErrorLoggerService.STORAGE_KEY] = errors;
      return this.storageSet(data);
    });
  }
}
