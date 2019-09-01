import { Component, OnInit } from '@angular/core';
import { ChromeDispatcherService } from '../../service/chrome-dispatcher.service';
import { BadgeManipulatorService } from '../../service/badge-manipulator.service';
import { AlarmService } from '../../service/alarm.service';
import { PreferenceService } from '../../../settings/services/preference.service';
import { OvaSyncService } from '../../service/sync/ova-sync.service';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss']
})
export class BackgroundComponent implements OnInit {

  constructor(
    private alarmService: AlarmService,
    private dispatcher: ChromeDispatcherService,
    private badgeManipulator: BadgeManipulatorService,
    private preferenceService: PreferenceService,
    private ovaSync: OvaSyncService
  ) {
    this.alarmService.onInstall();
    this.registerListeners();
  }

  ngOnInit() {
  }

  private registerListeners(): void {
    this.alarmService.addMainLoopListener(() => {
      this.mainLoop();
    });
    this.dispatcher.addListener(BadgeManipulatorService.ADDRESS, this.badgeManipulator);
  }

  private mainLoop(): void {
    // TODO: Chcek sync times
    // TODO: Save new sync time
    // TODO: Sync & notify
    console.log('Main loop check');
    this.preferenceService.get().then(( preference ) => {
      const syncPromises = [];
      this.ovaSync.syncAll(preference).then(() => {
        console.log('Main loop finished');
      });
    });
  }
}
