import { IStorable } from '../types/IStorable';

export class LocalMapDataSorage<T extends IStorable> {
    private readonly dataMap = new Map<string, T>();
    private data: T[] = [];

    public constructor(private readonly key: string) {
        const data = localStorage.getItem(this.key);
        if (data) {
            this.data = JSON.parse(data) as T[];
            this.data.forEach((item) => {
                if (!item.id) {
                    return;
                }
                this.dataMap.set(item.id, item);
            });
        }
    }

    public get(id: string) {
        return this.dataMap.get(id);
    }

    public set(item: T) {
        if (!item.id) {
            return;
        }
        this.dataMap.set(item.id, item);
        this.updateData();
    }

    public delete(id: string) {
        this.dataMap.delete(id);
        this.updateData();
    }

    public getAll() {
        return this.data;
    }

    public setAll(item: T[]) {
        this.dataMap.clear();
        item.forEach((i) => {
            if (!i.id) {
                return;
            }
            this.dataMap.set(i.id, i);
        });
        this.updateData();
    }

    private updateData() {
        this.data = Array.from(this.dataMap.values());
        localStorage.setItem(this.key, JSON.stringify(this.data));
    }
}
