import { Injectable } from '@angular/core';
import { ChromeDispatcherListener } from './chrome-dispatcher-listener';

@Injectable({
  providedIn: 'root'
})
export class BadgeManipulatorService implements ChromeDispatcherListener {

  public static readonly ADDRESS = 'BadgeManipulator';

  constructor() {

  }

  public onMessage( message: any, sender: chrome.runtime.MessageSender, sendResponse: ( response?: any ) => void ): void {
    const data = {
      text: message.text
    };
    if (message.hasOwnProperty('tabId')) {
      data['tabId'] = sender.tab.id;
    }
    chrome.browserAction.setBadgeText(data);
  }

}
