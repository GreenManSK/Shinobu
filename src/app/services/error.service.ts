import { Injectable } from '@angular/core';
import { LogError } from '../types/log-error';
import { ChromeDispatcherService } from '../modules/background/service/chrome-dispatcher.service';
import { ChromeDispatcherListener } from '../modules/background/service/chrome-dispatcher-listener';

export type ErrorListener = ( error: LogError ) => void;

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  private static readonly ADDRESS = 'ErrorService';

  private listeners: ErrorListener[] = [];

  constructor( private dispatcher: ChromeDispatcherService ) {
    dispatcher.addListener(ErrorService.ADDRESS, new ErrorListenerHelper(this.onError.bind(this)));
  }

  public sendError( logError: LogError ): void {
    this.dispatcher.sendMessage(ErrorService.ADDRESS, {error: logError});
  }

  private onError( error: LogError ): void {
    for (const listener of this.listeners) {
      listener(error);
    }
  }

  public addListener( listener: ErrorListener ): void {
    this.listeners.push(listener);
  }

  public removeListener( listener: ErrorListener ): void {
    const index = this.listeners.indexOf(listener, 0);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }
}

class ErrorListenerHelper implements ChromeDispatcherListener {
  constructor( private listener: ErrorListener ) {
  }

  onMessage( message: any, sender: chrome.runtime.MessageSender, sendResponse: ( response?: any ) => void ): void {
    this.listener(message.error);
  }

}
