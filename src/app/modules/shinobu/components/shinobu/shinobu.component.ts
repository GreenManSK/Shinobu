import { Component, OnInit } from '@angular/core';
import { Tab } from '../../types/tab';

@Component({
  selector: 'app-shinobu',
  templateUrl: './shinobu.component.html',
  styleUrls: ['./shinobu.component.scss']
})
export class ShinobuComponent implements OnInit {

  public isChristmasTime: boolean;

  public tab: Tab;

  constructor() {
    this.checkChristmasTime();
  }

  ngOnInit() {
  }

  public checkChristmasTime(): void {
    const today = new Date();
    this.isChristmasTime = today.getMonth() === 11 || (today.getMonth() === 0 && today.getDate() < 10);
  }

  public onTabChanged( tab: Tab ): void {
    this.tab = tab;
  }
}
