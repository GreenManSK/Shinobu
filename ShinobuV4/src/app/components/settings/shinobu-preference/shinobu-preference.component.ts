import { Component, OnInit } from '@angular/core';
import { Color } from '../../../types/Color';
import { ShinobuSettings } from 'src/app/data/shinobu/ShinobuSettings';
import { AlertService } from 'src/app/services/alert.service';
import { ShinobuSettingsService } from 'src/app/services/data/shinobu/shinobu-settings.service';
import { Alert } from 'src/app/types/Alert';
import { AlertType } from 'src/app/types/AlertType';
import { Subscription } from 'rxjs';
import { ChristmasThemeType, ThemeType } from 'src/app/types/shinobu/ThemeType';

@Component({
  selector: 'shinobu-preference',
  templateUrl: './shinobu-preference.component.html',
  styleUrls: ['./shinobu-preference.component.scss'],
})
export class ShinobuPreferenceComponent implements OnInit {
  public readonly color = Color.Blue;
  public readonly themes = [ThemeType.Shinobu, ThemeType.Gura, ThemeType.Fauna];
  public readonly christmasThemes = [
    ChristmasThemeType.Shinobu,
    ChristmasThemeType.Fauna,
  ];

  public settings?: ShinobuSettings;

  private subscription?: Subscription;

  constructor(
    private shinobuSettingsService: ShinobuSettingsService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
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
        new Alert('Shinobu', 'Settings saved', AlertType.success)
      );
    });
  }

  public setTheme(target: any) {
    this.settings!.theme = target.value;
  }

  public setChristmasTheme(target: any) {
    this.settings!.christmasTheme = target.value;
  }
}
