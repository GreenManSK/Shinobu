import MessageSender = chrome.runtime.MessageSender;

export interface ChromeDispatcherListener {
  onMessage( message: any, sender: MessageSender, sendResponse: ( response?: any ) => void ): void;
}
