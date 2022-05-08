import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user: firebase.User | null = null;
  private subject: Subject<boolean> = new Subject<boolean>();

  constructor( private auth: AngularFireAuth ) {
    this.auth.onAuthStateChanged(user => {
      this.user = user;
      this.subject.next(this.isAuthenticated());
    });
  }

  public subscribe( callback: () => void ) {
    const subscription = this.subject.subscribe(callback);
    return () => subscription.unsubscribe();
  }

  public isAuthenticatedPromise(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      const unsubscribePromise = this.auth.onAuthStateChanged(user => {
        resolve(!!user);
        unsubscribePromise.then(unsubscribe => unsubscribe());
      });
    });
  }

  public getUserId() {
    return this.user?.uid;
  }

  public isAuthenticated() {
    return this.user !== null;
  }
}
