import { useEffect, useMemo, useState } from "react";
import { ISavable, useStorage } from "./storage-context";

export const useAllData = <T extends ISavable>(collectionName: string): T[] => {
  const { getAll } = useStorage();
  const [data, setData] = useState<T[]>([]);
  useEffect(() => {
    const subscription = getAll<T>(collectionName).subscribe(setData);
    return () => subscription.unsubscribe();
  }, [collectionName, getAll]);
  return data;
};

export const useDataById = <T extends ISavable>(
  collectionName: string,
  id: string
): T | undefined => {
  const { getById } = useStorage();
  const [data, setData] = useState<T>();
  useEffect(() => {
    const subscription = getById<T>(collectionName, id).subscribe(setData);
    return () => subscription.unsubscribe();
  }, [collectionName, id, getById]);
  return data;
};

export const useMutateData = <T extends ISavable>(collectionName: string) => {
  const { save, remove } = useStorage();
  return useMemo(
    () => ({
      save: (item: T) => save<T>(collectionName, item),
      remove: (item: T) => remove<T>(collectionName, item),
    }),
    [collectionName, save, remove]
  );
};
