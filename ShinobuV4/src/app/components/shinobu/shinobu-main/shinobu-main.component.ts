import { Component, OnInit } from '@angular/core';
import { Tab } from '../../../data/shinobu/Tab';
import { ShinobuSettings } from 'src/app/data/shinobu/ShinobuSettings';
import { ShinobuSettingsService } from 'src/app/services/data/shinobu/shinobu-settings.service';
import { Subscription } from 'rxjs';
import { ChristmasThemeType, ThemeType } from 'src/app/types/shinobu/ThemeType';

@Component({
  selector: 'app-shinobu-main',
  templateUrl: './shinobu-main.component.html',
  styleUrls: ['./shinobu-main.component.scss'],
})
export class ShinobuMainComponent implements OnInit {
  public isChristmasTime: boolean = false;
  public tab?: Tab;
  public settings?: ShinobuSettings;

  private subscription?: Subscription;

  public readonly isMobile = /iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  constructor(
    private shinobuSettingsService: ShinobuSettingsService
  ) {
    this.checkChristmasTime();
  }

  ngOnInit(): void {
    this.settings = this.shinobuSettingsService.getDefault();
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

  public checkChristmasTime(): void {
    const today = new Date();
    this.isChristmasTime =
      today.getMonth() === 11 ||
      (today.getMonth() === 0 && today.getDate() < 10);
  }

  public onTabChanged(tab: Tab): void {
    this.tab = tab;
  }

  public getClass() {
    const theme = this.isChristmasTime
      ? this.settings?.christmasTheme
      : this.settings?.theme;
    return {
      christmas: this.isChristmasTime,
      hasVideo: !this.isMobile,
      [theme ?? '']: true,
    };
  }

  public get video() {
    if (this.isChristmasTime) {
      if (this.settings?.christmasTheme === ChristmasThemeType.Fauna) {
        return '/assets/img/fauna-christmas.mp4';
      }
    } else {
      if (this.settings?.theme === ThemeType.Gura) {
        return '/assets/img/gura.mp4';
      }
      if (this.settings?.theme === ThemeType.Fauna) {
        return '/assets/img/fauna.mp4';
      }
    }

    return undefined;
  }
}
