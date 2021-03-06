import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorLoggerService } from './services/error-logger.service';
import { MigrationV2Service } from './services/migration-v2.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'shinobu';

  constructor(
    private router: Router,
    errorLogger: ErrorLoggerService
  ) {
    errorLogger.start();
 }

  public isBackground(): boolean {
    return this.router.url.startsWith('/background');
  }

  public showMenu(): boolean {
    return !this.router.url.startsWith('/kirino-form') && !this.router.url.startsWith('/browser-action');
  }
}
