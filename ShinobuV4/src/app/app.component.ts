import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppUpdateService } from './services/app-update.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor( private router: Router, appUpdateService: AppUpdateService ) {
  }

  public isBackground(): boolean {
    return this.router.url.startsWith('/background');
  }

  public showMenu(): boolean {
    return !this.router.url.startsWith('/kirino-form') && !this.router.url.startsWith('/browser-action');
  }

  public isKirino(): boolean {
    return this.router.url.startsWith('/kirino');
  }
}
