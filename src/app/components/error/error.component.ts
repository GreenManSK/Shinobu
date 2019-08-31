import { Component, OnInit } from '@angular/core';
import { ErrorService } from '../../services/error.service';
import { LogError } from '../../types/log-error';

@Component({
  selector: 'error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  private static readonly TIMEOUT_IN_MS = 10000;

  public errors: LogError[] = [];

  constructor( errorService: ErrorService ) {
    errorService.addListener(this.onError.bind(this));
  }

  ngOnInit() {
  }

  public onError( error: LogError ): void {
    this.errors.push(error);
    setTimeout(() => {
      this.removeError(error);
    }, ErrorComponent.TIMEOUT_IN_MS);
  }

  public removeError( error: LogError ): void {
    const index = this.errors.indexOf(error, 0);
    if (index > -1) {
      this.errors.splice(index, 1);
    }
  }
}
