import { Component, OnInit } from '@angular/core';
import { KirinoSyncService } from '../../services/sync/kirino/kirino-sync.service';
import { AlarmService } from '../../services/chrome/alarm.service';
import { BadgeManipulatorService } from '../../services/chrome/badge-manipulator.service';
import { ChromeDispatcherService } from '../../services/chrome/chrome-dispatcher-service.service';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss']
})
export class BackgroundComponent implements OnInit {

  constructor(
    private kirinoSyncService: KirinoSyncService,
    private alarmService: AlarmService,
    private badgeManipulator: BadgeManipulatorService,
    private dispatcher: ChromeDispatcherService,
  ) {
    this.alarmService.onInstall();
    this.registerListeners();
  }

  ngOnInit(): void {
  }

  private registerListeners(): void {
    this.alarmService.addMainLoopListener(() => {
      this.mainLoop();
    });
    this.dispatcher.addListener(BadgeManipulatorService.ADDRESS, this.badgeManipulator);
  }

  private mainLoop() {
    // console.log('Main loop check');
    // this.kirinoSyncService.run().then(() => {
    //   console.log('Main loop finished');
    // });
  }
}
