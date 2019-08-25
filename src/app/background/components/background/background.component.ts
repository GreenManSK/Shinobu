import { Component, OnInit } from '@angular/core';
import { ChromeDispatcherService } from '../../service/chrome-dispatcher.service';
import { BadgeManipulatorService } from '../../service/badge-manipulator.service';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss']
})
export class BackgroundComponent implements OnInit {

  constructor(
    private dispatcher: ChromeDispatcherService,
    private badgeManipulator: BadgeManipulatorService
  ) {
    this.registerListeners();
  }

  ngOnInit() {
  }

  private registerListeners(): void {
    this.dispatcher.addListener(BadgeManipulatorService.ADDRESS, this.badgeManipulator);
  }
}
