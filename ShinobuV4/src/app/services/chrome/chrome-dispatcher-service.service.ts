/// <reference types="chrome" />
import { Injectable } from '@angular/core';
import MessageSender = chrome.runtime.MessageSender;
import { ChromeDispatcherListener } from './chrome-dispatcher-listener';

@Injectable({
  providedIn: 'root'
})
export class ChromeDispatcherService {

  private listeners: { [key: string]: ChromeDispatcherListener } = {};

  constructor() {
    const instance = this;
    if (chrome && chrome.runtime && chrome.runtime.onMessage) {
      chrome.runtime.onMessage.addListener(( ...args ) => {
          instance.dispatchMessage.apply(instance, args);
        }
      );
    }
  }

  private dispatchMessage( message: any, sender: MessageSender, sendResponse: ( response?: any ) => void ): void {
    if (message.hasOwnProperty('address')) {
      const listener = this.listeners[message.address] as ChromeDispatcherListener;
      if (listener) {
        listener.onMessage(message, sender, sendResponse);
      }
    } else {
      for (const listener of Object.values(this.listeners)) {
        (listener as ChromeDispatcherListener).onMessage(message, sender, sendResponse);
      }
    }
  }

  public sendMessage( address: string, data: object ): Promise<void> {
    return new Promise<void>(( resolve ) => {
      chrome.runtime.sendMessage({
        ...data,
        address
      }, () => resolve());
    });
  }

  public addListener( address: string, listener: ChromeDispatcherListener ): void {
    this.listeners[address] = listener;
  }

  public removeListener( address: string ): void {
    delete this.listeners[address];
  }
}
