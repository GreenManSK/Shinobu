import { Injectable } from '@angular/core';
import { LogError } from '../types/LogError';
import { AlertService } from './alert.service';
import { Alert } from '../types/Alert';
import { AlertType } from '../types/AlertType';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor( private alertService: AlertService ) {
  }

  public sendError( error: LogError ): void {
    console.error(error.source, error.text, error.exception);
    this.alertService.publish(new Alert(error.source, error.text, AlertType.error));
  }
}
