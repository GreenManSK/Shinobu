import { Component, OnInit } from '@angular/core';
import { ChromeDispatcherService } from '../../service/chrome-dispatcher.service';
import { BadgeManipulatorService } from '../../service/badge-manipulator.service';
import { AlarmService } from '../../service/alarm.service';
import { PreferenceService } from '../../../settings/services/preference.service';
import { OvaSyncService } from '../../service/sync/ova-sync.service';
import { AnimeSyncService } from '../../service/sync/anime-sync.service';
import { ShowSyncService } from '../../service/sync/show-sync.service';
import { MusicSyncService } from '../../service/sync/music-sync.service';
import { MangaSyncService } from '../../service/sync/manga-sync.service';

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
    private animeSync: AnimeSyncService,
    private ovaSync: OvaSyncService,
    private showSync: ShowSyncService,
    private musicSync: MusicSyncService,
    private mangaSync: MangaSyncService,
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
    console.log('Main loop check');
    this.preferenceService.get().then(( preference ) => {
      const syncPromises = preference.kirino.enableAutoSync ? [
        this.animeSync.syncAll(preference),
        this.showSync.syncAll(preference),
        this.ovaSync.syncAll(preference),
        ...this.musicSync.syncAll(preference),
        this.mangaSync.syncAll(preference)
      ] : [];
      Promise.all(syncPromises).then(() => {
        console.log('Main loop finished');
      });
    });
  }
}
