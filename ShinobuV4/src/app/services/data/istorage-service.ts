import { ISavable } from '../../data/ISavable';
import { Observable } from 'rxjs';

export interface IStorageService<T extends ISavable> {

  onReady(): Promise<void>;

  getAll(): Observable<T[]>;

  getById( id: string ): Observable<T>;

  save( item: T ): Promise<T>;

  delete( item: T ): Promise<void>;
}
