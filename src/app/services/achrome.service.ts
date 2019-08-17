import { Savable } from '../types/savable';
import { IChromeService } from './ichrome-service';
import { StoragePromiseService } from './storage-promise.service';

/**
 * Saves entities to storage under key {TypeName}#{EntityId} and list of all under key {TypeName}
 */
export abstract class AChromeService extends StoragePromiseService implements IChromeService {
  private static readonly DIVIDER = '#';

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

  private getStorageId(id: number): string {
    return this.getTypeName() + AChromeService.DIVIDER + id;
  }

  private generateId() {
    return ~~(Math.random() * 10000000);
  }
}
