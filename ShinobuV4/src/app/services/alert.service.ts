import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AlertEvent } from '../types/AlertEvent';
import { Alert } from '../types/Alert';
import { AlertEventType } from '../types/AlertEventType';
import { AlertType } from '../types/AlertType';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private alertSubject: Subject<AlertEvent>;
  private alertObservable: Observable<AlertEvent>;

  constructor() {
    this.alertSubject = new Subject<AlertEvent>();
    this.alertObservable = this.alertSubject.asObservable();
  }

  public subscribe( callback: ( event: AlertEvent ) => void ) {
    const subscription = this.alertObservable.subscribe(callback);
    return () => subscription.unsubscribe();
  }

  public publish( alert: Alert ) {
    alert.id = ~~(Math.random() * 10000000);
    this.logAlert(alert);
    this.alertSubject.next(new AlertEvent(alert, AlertEventType.Show));
    return () => this.alertSubject.next(new AlertEvent(alert, AlertEventType.Hide));
  }

  private logAlert( alert: Alert ) {
    if (alert.type === AlertType.error) {
      return;
    }
    switch (alert.type) {
      case AlertType.success:
        console.log(`${alert.source}: ${alert.text}`);
        return;
      case AlertType.warning:
        console.warn(`${alert.source}: ${alert.text}`);
        return;
      default:
        console.error(`${alert.source}: ${alert.text}`);
    }
  }
}
