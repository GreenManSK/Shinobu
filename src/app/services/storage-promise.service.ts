/// <reference types="chrome"/>

import StorageArea = chrome.storage.StorageArea;
import lastError = chrome.runtime.lastError;
import { ErrorService } from './error.service';
import { LogError } from '../types/log-error';

export abstract class StoragePromiseService {

  public readonly storage: StorageArea;

  constructor(
    storage: StorageArea,
    protected errorService: ErrorService
  ) {
    this.storage = storage;
  }

  protected storageGet( keys: string | string[] ): Promise<any> {
    return new Promise<any>(( resolve, reject ) => {
      this.storage.get(keys, ( items ) => {
        const error = this.checkError();
        if (error) {
          reject(error);
        } else {
          resolve(items);
        }
      });
    });
  }

  protected storageGetOne( key: string ): Promise<any> {
    return this.storageGet(key).then(( items ) => items[key]);
  }

  protected storageSet( items: object ): Promise<void> {
    return new Promise<any>(( resolve, reject ) => {
      this.storage.set(items, () => {
        const error = this.checkError();
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  protected storageRemove( keys: string | string[] ): Promise<any> {
    return new Promise<any>(( resolve, reject ) => {
      this.storage.remove(keys, () => {
        const error = this.checkError();
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  protected checkError() {
    if (lastError) {
      this.errorService.sendError(new LogError(this.constructor.name, lastError.message));
      return true;
    }
    return false;
  }
}
