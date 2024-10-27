import { Component, OnInit } from '@angular/core';
import { Tab } from '../../../data/shinobu/Tab';
import { ShinobuSettings } from 'src/app/data/shinobu/ShinobuSettings';
import { ShinobuSettingsService } from 'src/app/services/data/shinobu/shinobu-settings.service';
import { Subscription } from 'rxjs';

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

  public readonly isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  constructor(private shinobuSettingsService: ShinobuSettingsService) {
    this.checkChristmasTime();
  }

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
}
