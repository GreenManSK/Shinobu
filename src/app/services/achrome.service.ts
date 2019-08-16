/// <reference types="chrome"/>

import { Savable } from '../types/savable';
import { IChromeService } from './ichrome-service';
import StorageArea = chrome.storage.StorageArea;
import lastError = chrome.runtime.lastError;

/**
 * Saves entities to storage under key {TypeName}#{EntityId} and list of all under key {TypeName}
 */
export abstract class AChromeService implements IChromeService {
  private static readonly DIVIDER = '#';

  public readonly storage: StorageArea;

  constructor(storage: StorageArea) {
    this.storage = storage;
  }

  protected abstract getTypeName(): string;

  get(id: number): Promise<Savable> {
    return this.storageGetOne(this.getStorageId(id));
  }

  getAll(): Promise<Savable[]> {
    return this.getAllIds().then((keys) => this.storageGet(keys)).then(items => Object.values(items));
  }

  save(item: Savable): Promise<void> {
    if (!item.id) {
      item.id = this.generateId();
    }
    const storageId = this.getStorageId(item.id);
    return this.getAllIds().then(keys => {
      keys.push(storageId);
      const data = {};
      data[this.getTypeName()] = keys;
      data[storageId] = item;
      return this.storageSet(data);
    });
  }

  delete(item: Savable): Promise<void> {
    if (!item.id) {
      return Promise.reject('Savable item do not have id');
    }
    const storageId = this.getStorageId(item.id);
    return this.getAllIds().then(keys => {
      const index = keys.indexOf(storageId, 0);
      if (index > -1) {
        keys.splice(index, 1);
      }
      const data = {};
      data[this.getTypeName()] = keys;
      return this.storageSet(data);
    }).then(() => {
      return this.storageRemove(storageId);
    });
  }

  private getAllIds(): Promise<string[]> {
    return this.storageGet(this.getTypeName()).then(items => {
      return items[this.getTypeName()] ? items[this.getTypeName()] : [];
    });
  }

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

  private storageGetOne(key: string): Promise<any> {
    return this.storageGet(key).then((items) => items[key]);
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

  private getStorageId(id: number): string {
    return this.getTypeName() + AChromeService.DIVIDER + id;
  }

  private generateId() {
    return ~~(Math.random() * 10000000);
  }

  private checkError() {
    // TODO: Log errors
    return lastError;
  }
}
