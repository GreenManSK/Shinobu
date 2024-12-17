import React from "react";
import { Observable } from "rxjs";

export interface ISavable {
  id?: string;
  userId?: string;
  // toPlainObject(): object;
}

export interface IStorageContext {
  getAll<T extends ISavable>(collectionName: string): Observable<T[]>;
  getById<T extends ISavable>(
    collectionName: string,
    id: string
  ): Observable<T | undefined>;
  save<T extends ISavable>(collectionName: string, item: T): Promise<T>;
  remove<T extends ISavable>(collectionName: string, item: T): Promise<void>;
}

export const StorageContext = React.createContext<IStorageContext>(
  {} as IStorageContext
);
export const useStorage = () => React.useContext(StorageContext);
