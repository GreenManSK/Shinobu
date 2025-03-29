import { ICollectionStorage } from './ICollectionStorage';
import { IStorable } from './IStorable';

export interface IDataStorage {
    getCollection<T extends IStorable>(
        collectionName: string
    ): ICollectionStorage<T>;
}
