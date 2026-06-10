import { Component, OnInit } from '@angular/core';
import { Color } from '../../../types/Color';
import { ShinobuSettings } from 'src/app/data/shinobu/ShinobuSettings';
import { AlertService } from 'src/app/services/alert.service';
import { ShinobuSettingsService } from 'src/app/services/data/shinobu/shinobu-settings.service';
import { Alert } from 'src/app/types/Alert';
import { AlertType } from 'src/app/types/AlertType';
import { Subscription } from 'rxjs';
import { ChristmasThemeType, ThemeType } from 'src/app/types/shinobu/ThemeType';
import { LocalPreferenceService } from 'src/app/services/data/local-preference.service';

@Component({
  selector: 'shinobu-preference',
  templateUrl: './shinobu-preference.component.html',
  styleUrls: ['./shinobu-preference.component.scss'],
})
export class ShinobuPreferenceComponent implements OnInit {
  private static readonly WORK_MODE_KEY = 'workModeOverride';

  public readonly color = Color.Blue;
  public readonly themes = [
    ThemeType.Shinobu,
    ThemeType.Gura,
    ThemeType.Fauna,
    ThemeType.Fauna2,
    ThemeType.FaunaNun,
  ];
  public readonly christmasThemes = [
    ChristmasThemeType.Shinobu,
    ChristmasThemeType.Fauna,
  ];

  public settings?: ShinobuSettings;
  public workMode = false;

  private subscription?: Subscription;

  constructor(
    private shinobuSettingsService: ShinobuSettingsService,
    private alertService: AlertService,
    private localPreferenceService: LocalPreferenceService,
  ) {}

  ngOnInit(): void {
    this.workMode = this.localPreferenceService.get(
      ShinobuPreferenceComponent.WORK_MODE_KEY,
      false,
    );

    this.shinobuSettingsService.onReady().then(() => {
      this.subscription = this.shinobuSettingsService
        .asObservable()
        .subscribe((settings) => {
          this.settings = settings;
        });
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  reloadApp($event: MouseEvent) {
    $event.preventDefault();
    location.reload();
  }

  public save(event: any) {
    if (event) {
      event.preventDefault();
    }
    if (!this.settings) {
      return;
    }
    this.shinobuSettingsService.update(this.settings).then(() => {
      this.alertService.publish(
        new Alert('Shinobu', 'Settings saved', AlertType.success),
      );
    });
  }

  public setTheme(target: any) {
    this.settings!.theme = target.value;
  }

  public setChristmasTheme(target: any) {
    this.settings!.christmasTheme = target.value;
  }

  public setWorkMode(target: any): void {
    this.workMode = target.checked;
    this.localPreferenceService.set(
      ShinobuPreferenceComponent.WORK_MODE_KEY,
      this.workMode,
    );
  }
}
