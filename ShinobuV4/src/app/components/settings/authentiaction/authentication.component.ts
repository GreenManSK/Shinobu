import { Component, OnDestroy, OnInit } from '@angular/core';
import { Color } from '../../../types/Color';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit, OnDestroy {

  public readonly color = Color.Blue;

  public isAuthenticated = false;

  private authUnsubscribe?: () => void;

  constructor( public authService: AuthService ) {
    authService.isAuthenticatedPromise().then(isAuthenticated => this.isAuthenticated = isAuthenticated);
  }

  ngOnInit(): void {
    this.authUnsubscribe = this.authService.subscribe((isAuthenticated => this.isAuthenticated = isAuthenticated));
  }

  ngOnDestroy(): void {
    this.authUnsubscribe && this.authUnsubscribe();
  }

  public signInGoogle($event: any) {
    if ($event) {
      $event.preventDefault();
    }
    this.authService.singInGoogle();
  }

  public singInGithub($event: any) {
    if ($event) {
      $event.preventDefault();
    }
    this.authService.singInGithub();
  }

  public signOut($event: any) {
    if ($event) {
      $event.preventDefault();
    }
    this.authService.signOut();
  }
}
