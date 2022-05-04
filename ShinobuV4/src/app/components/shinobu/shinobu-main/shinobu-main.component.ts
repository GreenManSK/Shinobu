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
    new Tile("Hoshimachi!", "", "", 0),
    new Tile("Marin!", "", "", 1),
    new Tile("Aqua!", "", "", 2),
    new Tile("Kanata!", "", "", 3),
    new Tile("Coco!", "", "", 4),
    new Tile("Cali!", "", "", 5),
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
