import {Injectable} from '@angular/core';
import {Savable} from '../types/savable';
import {IChromeService} from './ichrome-service';
import StorageArea = chrome.storage.StorageArea;
import lastError = chrome.runtime.lastError;

@Injectable({
  providedIn: 'root'
})

/**
 * Saves entities to storage under key {TypeName}#{EntityId} and list of all under key {TypeName}
 */
export abstract class AChromeServiceService implements IChromeService {
  private static readonly DIVIDER = '#';

  public readonly storage: StorageArea;

  constructor(storage: StorageArea) {
    this.storage = storage;
  }

  protected abstract getTypeName(): string;

  // // TODO: Add method for getting just the id list
  //
  // public getAll(callback: (result: Savable[]) => void): void {
  //   // TODO: Fix to get all by IDS
  //   this.storage.get(this.getTypeName, (items) => {
  //     if (this.checkError()) {
  //       callback(null);
  //       return;
  //     }
  //     let result = items[this.getTypeName()];
  //     if (!result) {
  //       result = [];
  //     }
  //     callback(result);
  //   });
  // }
  //
  // public get(id: number, callback: (result: Savable) => void): void {
  //   const storageId = this.getStorageId(id);
  //   this.storage.get(storageId, (items) => {
  //     callback(items[sorageId]);
  //   });
  // }
  //
  // public save(item: Savable, callback: (success: boolean) => void): void {
  //   if (!item.id) {
  //     item.id = this.generateId();
  //   }
  //   const storageId = this.getStorageId(item.id);
  //   // TODO: Use just id list
  //   this.getAll((items) => {
  //     if (items == null) {
  //       callback(false);
  //       return;
  //     }
  //     items.push(storageId);
  //     const data = {};
  //     data[storageId] = item;
  //     data[this.getTypeName()] = items;
  //     this.storage.set(data, () => {
  //       callback(this.checkError());
  //     });
  //   });
  // }
  //
  // public delete(item: Savable, callback: (success: boolean) => void): void {
  //   if (!item.id) {
  //     callback(false);
  //     return;
  //   }
  //   const storageId = this.getStorageId(item.id);
  //   // TODO: Use just id list
  //   this.getAll((items) => {
  //     if (items == null) {
  //       callback(false);
  //       return;
  //     }
  //     this.storage.remove(storageId, () => {
  //       if (this.checkError()) {
  //         callback(false);
  //         return;
  //       }
  //       const index = items.indexOf(storageId, 0);
  //       if (index > -1) {
  //         items.splice(index, 1);
  //       }
  //       const data = {};
  //       data[this.getTypeName()] = items;
  //       this.storage.set(data, () => {
  //         callback(this.checkError());
  //       });
  //     });
  //   });
  // }

  private storageGet(keys: string | string[]): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.storage.get(keys, (items) => {
        const error = this.checkError();
        if (error) {
          reject(error);
        } else {
          resolve(items);
        }
      });
    });
  }

  private storageSet(items: object): Promise<void> {
    return new Promise<any>((resolve, reject) => {
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

  private storageRemove(keys: string | string[]): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.storage.remove(keys, (items) => {
        const error = this.checkError();
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  private getStorageId(id: number): string {
    return this.getTypeName() + AChromeServiceService.DIVIDER + id;
  }

  private generateId() {
    return ~~(Math.random() * 10000000);
  }

  private checkError() {
    // TODO: Log errors
    return lastError;
  }
}
