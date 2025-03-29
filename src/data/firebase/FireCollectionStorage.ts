import { Firestore } from 'firebase/firestore';
import {
    ICollectionStorage,
    UnsubscribeCallback,
} from '../types/ICollectionStorage';
import { IStorable } from '../types/IStorable';
import { Auth } from 'firebase/auth';
import { LocalMapDataSorage } from '../common/LocalMapDataStorage';
import {
    Unsubscribe,
    collection,
    onSnapshot,
    deleteDoc,
    doc,
    setDoc,
} from 'firebase/firestore';

export class FireCollectionStorage<T extends IStorable>
    implements ICollectionStorage<T>
{
    private readonly cacheStorage: LocalMapDataSorage<T>;
    private collectionUnsubscribe?: Unsubscribe;
    private readonly allSubscribers = new Set<(data: T[]) => void>();

    public constructor(
        private readonly collectionName: string,
        private readonly db: Firestore,
        private readonly auth: Auth
    ) {
        this.cacheStorage = new LocalMapDataSorage<T>(
            `shinobu_fire_${collectionName}`
        );
    }

    public subscribeAll(onNext: (data: T[]) => void): UnsubscribeCallback {
        this.prepareSubscription();
        this.allSubscribers.add(onNext);
        onNext(this.cacheStorage.getAll());
        return () => this.unsubscribe(onNext);
    }

    public subscribeId(
        id: string,
        onNext: (data: T | undefined) => void
    ): UnsubscribeCallback {
        const updateCallback = () => onNext(this.cacheStorage.get(id));
        this.allSubscribers.add(updateCallback);
        updateCallback();
        return () => this.unsubscribe(updateCallback);
    }

    public save(item: T): Promise<T> {
        if (!this.auth.currentUser) {
            throw new Error(
                'User is not authenticated. Cannot save item to Firestore.'
            );
        }
        item.userId = this.auth.currentUser?.uid;
        if (!item.id) {
            item.id = crypto.randomUUID();
        }
        return setDoc(doc(this.db, this.collectionName, item.id), item).then(
            () => item
        );
    }

    public delete(id: string): Promise<void> {
        return deleteDoc(doc(this.db, this.collectionName, id));
    }

    public getCachedItem(id: string) {
        return this.cacheStorage.get(id);
    }

    public getCached() {
        return this.cacheStorage.getAll();
    }

    private prepareSubscription() {
        if (this.collectionUnsubscribe) {
            return;
        }
        this.collectionUnsubscribe = onSnapshot(
            collection(this.db, this.collectionName),
            (snapshot) => {
                const data: T[] = snapshot.docs.map((doc) => {
                    const item = doc.data() as T;
                    item.id = doc.id;
                    return item;
                });
                this.cacheStorage.setAll(data);
                this.notifySubscribers();
            }
        );
    }

    private unsubscribe(onNext: (data: T[]) => void) {
        this.allSubscribers.delete(onNext);
        if (this.allSubscribers.size === 0 && this.collectionUnsubscribe) {
            this.collectionUnsubscribe();
            this.collectionUnsubscribe = undefined;
        }
    }

    private notifySubscribers(): void {
        this.allSubscribers.forEach((callback) =>
            callback(this.cacheStorage.getAll())
        );
    }
}
