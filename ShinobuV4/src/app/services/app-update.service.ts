import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Injectable({
  providedIn: 'root'
})
export class AppUpdateService {

  constructor( private readonly updates: SwUpdate ) {
    this.updates.available.subscribe(event => {
      this.showAppUpdateAlert();
    });
  }

  private showAppUpdateAlert() {
    if (confirm('New update available. Reload?')) {
      this.doAppUpdate();
    }
  }

  private doAppUpdate() {
    this.updates.activateUpdate().then(() => document.location.reload());
  }
}
