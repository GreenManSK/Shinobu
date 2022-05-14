import { Component, OnDestroy, OnInit } from '@angular/core';
import { Color } from '../../../types/Color';
import { KirinoSettingsService } from '../../../services/data/kirino/kirino-settings.service';
import { KirinoSettings } from '../../../data/kirino/KirinoSettings';
import { Subscription } from 'rxjs';
import { AlertService } from '../../../services/alert.service';
import { Alert } from '../../../types/Alert';
import { AlertType } from '../../../types/AlertType';
import { AnimeSyncService } from '../../../services/sync/kirino/anime-sync.service';

type KirinoRefreshSettings = {
  key: string,
  defaultValueInMins: number,
  label: string
};

@Component({
  selector: 'kirino-preference',
  templateUrl: './kirino-preference.component.html',
  styleUrls: ['./kirino-preference.component.scss']
})
export class KirinoPreferenceComponent implements OnInit, OnDestroy {

  public readonly color = Color.Orange;
  public readonly refreshSettings: KirinoRefreshSettings[] = [
    {
      key: AnimeSyncService.SYNC_KEY,
      defaultValueInMins: AnimeSyncService.DEFAULT_SYNC_TIME_IN_MINS,
      label: 'aniDB data refresh rate in mins'
    },
    {
      key: 'anison',
      defaultValueInMins: 24 * 60,
      label: 'Anisom data refresh rate in mins'
    },
    {
      key: 'tvdb',
      defaultValueInMins: 4 * 60,
      label: 'TheTVDB.com data refresh rate in mins'
    },
    {
      key: 'amazon',
      defaultValueInMins: 24 * 60,
      label: 'Amazon data refresh rate in mins'
    }
  ];

  public settings?: KirinoSettings;
  private subscription?: Subscription;

  constructor( private kirinoSettingsService: KirinoSettingsService, private alertService: AlertService ) {
  }

  ngOnInit(): void {
    this.kirinoSettingsService.onReady().then(() => {
      this.subscription = this.kirinoSettingsService.asObservable().subscribe(( settings ) => {
        this.settings = settings;
        this.refreshSettings.forEach(refresh => {
          if (this.settings && !this.settings?.refreshRatesInMins[refresh.key]) {
            this.settings.refreshRatesInMins[refresh.key] = refresh.defaultValueInMins;
          }
        });
      });
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  public save(event: any) {
    if (event) {
      event.preventDefault();
    }
    if (!this.settings) {
      return;
    }
    this.kirinoSettingsService.update(this.settings).then(() => {
      this.alertService.publish(new Alert("Kirino", "Settings saved", AlertType.success));
    });
  }

}
