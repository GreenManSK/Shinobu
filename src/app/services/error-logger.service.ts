import { Injectable } from '@angular/core';
import { ErrorService } from './error.service';
import { StoragePromiseService } from './storage-promise.service';
import { LogError } from '../types/log-error';
import { ChromeStorageProviderService } from './chrome-storage-provider.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorLoggerService extends StoragePromiseService {

  private static readonly STORAGE_KEY = 'ErrorsLog';

  constructor(
    chromeStorageProvider: ChromeStorageProviderService,
    protected errorService: ErrorService
  ) {
    super(chromeStorageProvider.getLocal(), errorService);
  }

  public start(): void {
    this.errorService.addListener(this.onError.bind(this));
  }

  public getAll(): Promise<LogError[]> {
    return this.storageGetOne(ErrorLoggerService.STORAGE_KEY).then(( result ) => {
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
