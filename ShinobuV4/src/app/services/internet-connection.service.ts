import { Injectable } from '@angular/core';
import { fromEvent, map, merge, Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InternetConnectionService {

  private connectionObservable: Observable<boolean>;
  private _isConnected: boolean = false;

  constructor() {
    this.connectionObservable = merge(
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
      new Observable(( sub: Observer<boolean> ) => {
        sub.next(navigator.onLine);
        sub.complete();
      })) as Observable<boolean>;
    this.connectionObservable.subscribe(connected => this._isConnected = connected);
  }

  public asObservable() {
    return this.connectionObservable;
  }

  public isConnected() {
    return this._isConnected;
  }
}

