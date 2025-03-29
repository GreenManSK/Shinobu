import { FireCollectionStorage } from './FireCollectionStorage';
import { IStorable } from '../types/IStorable';
import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';
import AES from 'crypto-js/aes';
import { enc as CryptoJSEnc } from 'crypto-js';
import {
    ICollectionStorage,
    UnsubscribeCallback,
} from '../types/ICollectionStorage';

type EncryptedDataItem = {
    data: string;
} & IStorable;

export class EncryptFireCollectionStorage<T extends IStorable>
    implements ICollectionStorage<T>
{
    private encryptPassword: string;
    private decryptPassword: string;
    private readonly fireStorage: FireCollectionStorage<EncryptedDataItem>;

    public constructor(
        collectionName: string,
        db: Firestore,
        auth: Auth,
        password: string
    ) {
        this.encryptPassword = password;
        this.decryptPassword = password;
        this.fireStorage = new FireCollectionStorage<EncryptedDataItem>(
            collectionName,
            db,
            auth
        );
    }

    public subscribeAll(onNext: (data: T[]) => void): UnsubscribeCallback {
        return this.fireStorage.subscribeAll((encryptedItems) => {
            const decryptedItems = encryptedItems.map((item) =>
                this.decryptItem(item)
            );
            onNext(decryptedItems);
        });
    }

    public subscribeId(
        id: string,
        onNext: (data: T | undefined) => void
    ): UnsubscribeCallback {
        return this.fireStorage.subscribeId(id, (encryptedItem) => {
            const decryptedItem = encryptedItem
                ? this.decryptItem(encryptedItem)
                : undefined;
            onNext(decryptedItem);
        });
    }

    public async save(item: T): Promise<T> {
        const encryptedItem = this.encryptItem(item);
        const savedItem = await this.fireStorage.save(encryptedItem);
        return this.decryptItem(savedItem);
    }

    public delete(id: string): Promise<void> {
        return this.fireStorage.delete(id);
    }

    public getCachedItem(id: string): T | undefined {
        const encryptedItem = this.fireStorage.getCachedItem(id);
        return encryptedItem ? this.decryptItem(encryptedItem) : undefined;
    }

    public getCached(): T[] {
        const encryptedItems = this.fireStorage.getCached();
        return encryptedItems.map((item) => this.decryptItem(item));
    }

    public setEncryptPassword(password: string): void {
        this.encryptPassword = password;
    }

    public setDecryptPassword(password: string): void {
        this.decryptPassword = password;
    }

    private encryptItem(item: T): EncryptedDataItem {
        const { id, userId, ...data } = item;
        const encryptedData = AES.encrypt(
            JSON.stringify(data),
            this.encryptPassword
        ).toString();
        return {
            id,
            userId,
            data: encryptedData,
        };
    }

    private decryptItem(item: EncryptedDataItem): T {
        const { id, userId } = item;
        const decryptedData = AES.decrypt(
            item.data,
            this.decryptPassword
        ).toString(CryptoJSEnc.Utf8);
        const data = JSON.parse(decryptedData);
        return {
            id,
            userId,
            ...data,
        } as T;
    }
}
