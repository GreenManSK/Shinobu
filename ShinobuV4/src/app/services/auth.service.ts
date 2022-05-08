import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Subject } from 'rxjs';
import firebase from 'firebase/compat/app';

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

  public subscribe( callback: (isAuthenticated: boolean) => void ) {
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

  public getUser() {
    return this.user;
  }

  public isAuthenticated() {
    return this.user !== null;
  }

  public singInGoogle() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(() => location.reload());
  }

  public singInGithub() {
    this.auth.signInWithPopup(new firebase.auth.GithubAuthProvider()).then(() => location.reload());
  }

  public signOut() {
    this.auth.signOut().then(() => location.reload());
  }
}
