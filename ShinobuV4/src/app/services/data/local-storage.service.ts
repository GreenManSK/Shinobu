import { ISavable } from '../../data/ISavable';
import { IStorageService } from './istorage-service';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';
import { ErrorService } from '../error.service';
import { LogError } from '../../types/LogError';


export class LocalStorageService<T extends ISavable> implements IStorageService<T> {
  private subject?: BehaviorSubject<T[]>;

  constructor( private collectionName: string, private errorService: ErrorService ) {

  }

  public onReady(): Promise<void> {
    return Promise.resolve();
  }

  public getAll(): Observable<T[]> {
    if (!this.subject) {
      this.subject = new BehaviorSubject<T[]>(JSON.parse(localStorage.getItem(this.collectionName) || '[]'));
    }
    return this.subject.asObservable();
  }

  public getById( id: string ): Observable<T> {
    return this.getAll().pipe(
      map(items => items.filter(item => item.id === id)),
      filter(items => items.length > 0),
      map(items => items[0])
    );
  }

  public save( item: T ): Promise<T> {
    let items = this.getItems();
    if (item.id) {
      const index = items.findIndex(i => i.id === item.id);
      if (index < 0) {
        this.handleError('save', 'Not found');
        return Promise.reject();
      }
      items[index] = item;
    } else {
      item.id = LocalStorageService.generateId();
      items.push(item);
    }
    this.saveItems(items);
    return Promise.resolve(item);
  }

  public delete( item: T ): Promise<void> {
    return new Promise<void>(( resolve, reject ) => {
      let items = this.getItems();
      const toDelete = items.findIndex(i => i.id === item.id);
      if (toDelete < 0) {
        this.handleError('delete', 'Not found');
        reject();
      } else {
        items = items.splice(toDelete, 1);
        this.saveItems(items);
        resolve();
      }
    });
  }

  private saveItems( items: T[] ) {
    localStorage.setItem(this.collectionName, JSON.stringify(items));
    this.subject?.next(items);
  }

  private getItems(): T[] {
    return JSON.parse(localStorage.getItem(this.collectionName) || '[]');
  }

  private handleError( method: string, message: string, ex?: Error ) {
    this.errorService.sendError(new LogError(`${this.constructor.name}(${this.collectionName})`, `${method}: ${message}`, ex));
  }

  private static generateId(): string {
    return `${~~(Math.random() * 10000000)}`;
  }

}
