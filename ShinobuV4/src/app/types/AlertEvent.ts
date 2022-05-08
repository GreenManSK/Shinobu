import { Alert } from './Alert';
import { AlertEventType } from './AlertEventType';

export class AlertEvent {
  constructor(
    public alert: Alert,
    public type: AlertEventType
  ) {
  }
}
