import { Component, OnInit } from '@angular/core';
import { BoxColor } from '../../../kirino/components/box/box-color.enum';
import { LogError } from '../../../../types/log-error';
import { ErrorLoggerService } from '../../../../services/error-logger.service';

@Component({
  selector: 'error-log',
  templateUrl: './error-log.component.html',
  styleUrls: ['./error-log.component.scss']
})
export class ErrorLogComponent implements OnInit {

  public readonly color = BoxColor.Red;

  public errors: LogError[] = [];

  constructor( private errorLogger: ErrorLoggerService ) {
  }

  ngOnInit() {
    this.errorLogger.getAll().then(( errors ) => this.errors = errors);
  }

  public clear( even: MouseEvent ): void {
    even.preventDefault();
    this.errorLogger.clear();
    this.errors = [];
  }

  public logToConsole( even: MouseEvent, error: LogError ): void {
    even.preventDefault();
    console.log(error);
  }

}
