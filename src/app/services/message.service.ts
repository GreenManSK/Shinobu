import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor() {
  }

  public sendMessage( address: string, message: any ): void {
    if (!chrome.runtime || !chrome.runtime.sendMessage) {
      return;
    }
    chrome.runtime.sendMessage({
      address,
      message
    });
  }

  public onMessage( address: string, callback: ( data: any ) => void ): void {
    if (!chrome.runtime || !chrome.runtime.onMessage) {
      return;
    }
    chrome.runtime.onMessage.addListener(( data ) => {
      if (data.hasOwnProperty('address') && data.address === address) {
        callback(data.message);
      }
    });
  }
}
