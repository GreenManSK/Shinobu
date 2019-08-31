import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlarmService {

  public static readonly MAIN_LOOP_ALARM = 'mainLoop';

  constructor() {
  }

  public onInstall(): void {
    chrome.runtime.onInstalled.addListener(() => {
      chrome.alarms.clearAll();
      chrome.alarms.create(AlarmService.MAIN_LOOP_ALARM, {
        when: Date.now() + 60 * 1000,
        periodInMinutes: 10
      });
    });
  }

  public addMainLoopListener( callback: () => void ): void {
    chrome.alarms.onAlarm.addListener(( alarm: { name: string } ) => {
      if (alarm.name === AlarmService.MAIN_LOOP_ALARM) {
        callback();
      }
    });
  }
}
