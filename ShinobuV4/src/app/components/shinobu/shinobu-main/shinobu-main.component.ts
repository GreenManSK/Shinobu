import { Component, OnInit } from '@angular/core';
import { Tab } from '../../../data/shinobu/Tab';
import { Tile } from '../../../data/shinobu/Tile';

@Component({
  selector: 'app-shinobu-main',
  templateUrl: './shinobu-main.component.html',
  styleUrls: ['./shinobu-main.component.scss']
})
export class ShinobuMainComponent implements OnInit {

  public isChristmasTime: boolean = false;
  public tab: Tab = new Tab("default", "default", [
    new Tile("Hoshimachi!", "", "", 0)
  ]);

  constructor() {
    this.checkChristmasTime();
  }

  ngOnInit(): void {

  }

  public checkChristmasTime(): void {
    const today = new Date();
    this.isChristmasTime = today.getMonth() === 11 || (today.getMonth() === 0 && today.getDate() < 10);
  }

}
