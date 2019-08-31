import { Component, OnInit } from '@angular/core';
import { ChromeDispatcherService } from '../../service/chrome-dispatcher.service';
import { BadgeManipulatorService } from '../../service/badge-manipulator.service';
import { AlarmService } from '../../service/alarm.service';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss']
})
export class BackgroundComponent implements OnInit {

  constructor(
    private alarmService: AlarmService,
    private dispatcher: ChromeDispatcherService,
    private badgeManipulator: BadgeManipulatorService
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
  }
}
