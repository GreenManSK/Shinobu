import { ISavable } from '../../data/ISavable';
import { IStorageService } from './istorage-service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AuthService } from '../auth.service';
import { ErrorService } from '../error.service';
import { catchError, map, Observable, Subject } from 'rxjs';
import { LogError } from '../../types/LogError';
import firebase from 'firebase/compat';

export class FirestoreStorageService<T extends ISavable> implements IStorageService<T> {

  private collection: AngularFirestoreCollection<T>;
  private subject?: Subject<T[]>;

  constructor( private collectionName: string, afs: AngularFirestore, private authService: AuthService, private errorService: ErrorService ) {
    this.collection = afs.collection<T>(collectionName);
  }

  public onReady(): Promise<void> {
    return Promise.resolve();
  }

  public getAll(): Observable<T[]> {
    if (!this.subject) {
      this.subject = new Subject<T[]>();
      this.collection.ref.where('userId', '==', this.authService.getUserId()).onSnapshot(( {docs} ) => {
        this.subject?.next(docs.map(this.snaphshotToData));
      }, error => {
        this.handleError('getAll', error.message)
        this.subject?.next([]);
      });
    }
    return this.subject.asObservable();
  }

  public getById( id: string ): Observable<T> {
    return this.collection.doc(id).get().pipe(
      catchError(error => {
        this.handleError(`getById(${id})`, error.message)
        return [];
      }),
      map(doc => this.snaphshotToData(doc)));
  }

  public save( item: T ): Promise<T> {
    item.userId = this.authService.getUserId();
    if (item.id) {
      return this.collection.doc(item.id).update(this.toPlainObject(item) as T).then(() => item, error => {
        this.handleError(`save(${item.id})`, error);
        return item;
      });
    }
    return this.collection.add(this.toPlainObject(item)  as T).then(ref => {
      item.id = ref.id;
      return item;
    }, error => {
      this.handleError(`save(new)`, error);
      return item;
    });
  }

  public delete( item: T ): Promise<void> {
    return this.collection.doc(item.id).delete().then(() => {
    }, error => {
      this.handleError(`delete(${item.id})`, error);
    });
  }

  private snaphshotToData( snapshot: firebase.firestore.DocumentSnapshot<T> | firebase.firestore.QueryDocumentSnapshot<T> ): T {
    return {
      id: snapshot.id,
      ...snapshot.data()
    } as T;
  }

  private handleError( method: string, message: string, ex?: Error ) {
    this.errorService.sendError(new LogError(`${this.constructor.name}(${this.collectionName})`, `${method}: ${message}`, ex));
  }

  private toPlainObject( item: T ) {
    if (item.toPlainObject) {
      return item.toPlainObject();
    }
    return {...item};
  }
}
