import { ISavable } from '../../data/ISavable';
import { IStorageService } from './istorage-service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../auth.service';
import { ErrorService } from '../error.service';
import { Observable, of } from 'rxjs';
import { FirestoreStorageService } from './firestore-storage.service';
import { LocalStorageService } from './local-storage.service';

export abstract class DynamicStorageService<T extends ISavable> implements IStorageService<T> {

  protected readyPromise: Promise<void>;
  private implementation?: IStorageService<T>;

  constructor( public readonly collectionName: string, afs: AngularFirestore, authService: AuthService, private errorService: ErrorService ) {
    this.readyPromise = authService.isAuthenticatedPromise().then(isAuthenticated => {
      if (this.implementation) {
        return;
      }
      this.implementation = isAuthenticated ? new FirestoreStorageService(collectionName, afs, authService, errorService) : new LocalStorageService(collectionName, errorService);
    });
  }

  public useLocalStorage() {
    this.implementation = new LocalStorageService(this.collectionName, this.errorService);
  }

  public onReady(): Promise<void> {
    return this.readyPromise;
  }

  public getAll(): Observable<T[]> {
    if (!this.implementation) {
      return of([]);
    }
    return this.implementation.getAll();
  }

  public getById( id: string ): Observable<T> {
    if (!this.implementation) {
      return of();
    }
    return this.implementation.getById(id);
  }

  public save( item: T ): Promise<T> {
    if (!this.implementation) {
      return Promise.reject();
    }
    return this.implementation.save(item);
  }

  delete( item: T ): Promise<void> {
    if (!this.implementation) {
      return Promise.reject();
    }
    return this.implementation.delete(item);
  }


}
