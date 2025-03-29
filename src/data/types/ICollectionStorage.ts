import { IStorable } from './IStorable';

export type UnsubscribeCallback = () => void;

export interface ICollectionStorage<T extends IStorable> {
    subscribeAll(onNext: (data: T[]) => void): UnsubscribeCallback;
    subscribeId(
        id: string,
        onNext: (data: T | undefined) => void
    ): UnsubscribeCallback;
    save(item: T): Promise<T>;
    delete(id: string): Promise<void>;
    getCachedItem(id: string): T | undefined;
    getCached(): T[];
}
