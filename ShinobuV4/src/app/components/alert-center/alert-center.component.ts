import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { Alert } from '../../types/Alert';
import { AlertEvent } from '../../types/AlertEvent';
import { AlertEventType } from '../../types/AlertEventType';
import { AlertType } from '../../types/AlertType';

@Component({
  selector: 'alert-center',
  templateUrl: './alert-center.component.html',
  styleUrls: ['./alert-center.component.scss']
})
export class AlertCenterComponent implements OnInit, OnDestroy {

  private static readonly TIMEOUT_IN_MS = 10000;

  public alerts: Alert[] = [];

  private alertUnsubscribe?: () => void;

  constructor( private alertService: AlertService ) {
  }

  ngOnInit(): void {
    this.alertUnsubscribe = this.alertService.subscribe(alert =>this.onAlertEvent(alert));
  }

  ngOnDestroy(): void {
    this.alertUnsubscribe && this.alertUnsubscribe();
  }

  private onAlertEvent( event: AlertEvent ) {
    if (event.type === AlertEventType.Hide) {
      this.removeAlert(event.alert);
    } else if (event.type === AlertEventType.Show) {
      this.alerts.push(event.alert);
      if (!event.alert.permanent) {
        setTimeout(() => {
          this.removeAlert(event.alert);
        }, AlertCenterComponent.TIMEOUT_IN_MS);
      }
    }
  }

  public removeAlert( toRemove: Alert ) {
    this.alerts = this.alerts.filter(alert => alert.id !== toRemove.id);
  }

  public toAlertTypeString( alertType: AlertType ) {
    switch (alertType) {
      case AlertType.error:
        return 'error';
      case AlertType.success:
        return 'success';
      case AlertType.warning:
        return 'warning';
    }
  }
}
