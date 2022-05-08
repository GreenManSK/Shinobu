import { AlertType } from './AlertType';

export class Alert {
  public id = 0;

  constructor(
    public source: string,
    public text: string,
    public type: AlertType,
    public permanent = false
  ) {
  }
}
