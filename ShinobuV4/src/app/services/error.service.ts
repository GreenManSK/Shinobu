import { Injectable } from '@angular/core';
import { LogError } from '../types/LogError';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  public sendError( error: LogError ): void {
    console.error(error.source, error.text, error.exception);
  }
}
