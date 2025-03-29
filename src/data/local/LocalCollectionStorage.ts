import { LocalMapDataSorage } from '../common/LocalMapDataStorage';
import {
    ICollectionStorage,
    UnsubscribeCallback,
} from '../types/ICollectionStorage';
import { IStorable } from '../types/IStorable';

export class LocalCollectionStorage<T extends IStorable>
    implements ICollectionStorage<T>
{
    private readonly allSubscribers = new Set<(data: T[]) => void>();
    private readonly dataStorage: LocalMapDataSorage<T>;

    constructor(collectionName: string) {
        this.dataStorage = new LocalMapDataSorage<T>(
            `shinobu_local_${collectionName}`
        );
    }

    public subscribeAll(onNext: (data: T[]) => void): UnsubscribeCallback {
        this.allSubscribers.add(onNext);
        onNext(this.dataStorage.getAll());
        return () => this.allSubscribers.delete(onNext);
    }

    public subscribeId(
        id: string,
        onNext: (data: T | undefined) => void
    ): UnsubscribeCallback {
        const updateCallback = () => onNext(this.dataStorage.get(id));
        this.allSubscribers.add(updateCallback);
        updateCallback();
        return () => this.allSubscribers.delete(updateCallback);
    }

    public save(item: T): Promise<T> {
        if (!item.id) {
            item.id = crypto.randomUUID();
        }
        this.dataStorage.set(item);
        this.notifySubscribers();
        return Promise.resolve(item);
    }

    public delete(id: string): Promise<void> {
        this.dataStorage.delete(id);
        this.notifySubscribers();
        return Promise.resolve();
    }

    public getCachedItem(id: string) {
        return this.dataStorage.get(id);
    }

    public getCached() {
        return this.dataStorage.getAll();
    }

    private notifySubscribers(): void {
        this.allSubscribers.forEach((callback) =>
            callback(this.dataStorage.getAll())
        );
    }
}
