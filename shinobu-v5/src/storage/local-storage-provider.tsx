import { FC, PropsWithChildren, useCallback, useMemo, useRef } from "react";
import { ISavable, StorageContext } from "./storage-context";
import { BehaviorSubject, map } from "rxjs";

export const LocalStorageProvider: FC<PropsWithChildren> = ({ children }) => {
  const subjectsRef = useRef<{ [key: string]: BehaviorSubject<any[]> }>({});

  const getAll = useCallback(<T extends ISavable>(collectionName: string) => {
    if (!subjectsRef.current[collectionName]) {
      subjectsRef.current[collectionName] = new BehaviorSubject<T[]>(
        JSON.parse(localStorage.getItem(collectionName) || "[]")
      );
    }
    return subjectsRef.current[collectionName];
  }, []);

  const value = useMemo(
    () => ({
      getAll: (collectionName: string) => getAll(collectionName).asObservable(),
      getById: (collectionName: string, id: string) =>
        getAll(collectionName).pipe(
          map((items) => items.find((item) => item.id === id))
        ),
      save: <T extends ISavable>(collectionName: string, item: T) => {
        let items = JSON.parse(localStorage.getItem(collectionName) || "[]");
        if (item.id) {
          const index = items.findIndex((i: T) => i.id === item.id);
          if (index < 0) {
            // TODO: Ping error service
            return Promise.reject();
          }
          items[index] = item;
        } else {
          item.id = `${~~(Math.random() * 10000000)}`;
          items.push(item);
        }
        localStorage.setItem(collectionName, JSON.stringify(items));
        getAll(collectionName).next(items);
        return Promise.resolve(item);
      },
      remove: <T extends ISavable>(collectionName: string, item: T) => {
        let items = JSON.parse(localStorage.getItem(collectionName) || "[]");
        const toDelete = items.findIndex((i: T) => i.id === item.id);
        if (toDelete < 0) {
          // TODO: Ping error service
          return Promise.reject();
        }
        items.splice(toDelete, 1);
        localStorage.setItem(collectionName, JSON.stringify(items));
        getAll(collectionName).next(items);
        return Promise.resolve();
      },
    }),
    [getAll]
  );

  return (
    <StorageContext.Provider value={value}>{children}</StorageContext.Provider>
  );
};
