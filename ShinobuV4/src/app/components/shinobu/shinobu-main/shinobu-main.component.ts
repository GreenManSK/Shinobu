import { Component, OnInit } from '@angular/core';
import { TabService } from '../../../services/data/shinobu/tab.service';
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
    new Tile("Just text", "https://www.greenmanov.net/", "", 0),
    new Tile("Just text", "https://www.greenmanov.net/", "ri-twitter-fill", 0),
    new Tile("Just text", "https://www.greenmanov.net/", "http://www.greenmanov.net/favicon.ico", 0),
    new Tile("Just text", "https://www.greenmanov.net/", "😅", 0),
    new Tile("Just text", "https://www.greenmanov.net/", "", 0),
    new Tile("Just text", "https://www.greenmanov.net/", "ri-twitter-fill", 0),
    new Tile("Just text", "https://www.greenmanov.net/", "http://www.greenmanov.net/favicon.ico", 0),
    new Tile("Just text", "https://www.greenmanov.net/", "😅", 0),
    new Tile("Just text", "https://www.greenmanov.net/", "", 0),
    new Tile("Just text", "https://www.greenmanov.net/", "ri-twitter-fill", 0),
    new Tile("Just text", "https://www.greenmanov.net/", "http://www.greenmanov.net/favicon.ico", 0),
    new Tile("Just text", "https://www.greenmanov.net/", "😅", 0),
    new Tile("Just text", "https://www.greenmanov.net/", "", 0),
    new Tile("Just text", "https://www.greenmanov.net/", "ri-twitter-fill", 0),
    new Tile("Just text", "https://www.greenmanov.net/", "http://www.greenmanov.net/favicon.ico", 0),
    new Tile("Just text", "https://www.greenmanov.net/", "😅", 0),
    new Tile("Just text", "https://www.greenmanov.net/", "", 0),
    new Tile("Just text", "https://www.greenmanov.net/", "ri-twitter-fill", 0),
    new Tile("Just text", "https://www.greenmanov.net/", "http://www.greenmanov.net/favicon.ico", 0),
    new Tile("Just text", "https://www.greenmanov.net/", "😅", 0),
    new Tile("Just text", "https://www.greenmanov.net/", "", 0),
    new Tile("Just text", "https://www.greenmanov.net/", "ri-twitter-fill", 0),
    new Tile("Just text", "https://www.greenmanov.net/", "http://www.greenmanov.net/favicon.ico", 0),
    new Tile("Just text", "https://www.greenmanov.net/", "😅", 0),
    new Tile("Just text", "https://www.greenmanov.net/", "", 0),
    new Tile("Just text", "https://www.greenmanov.net/", "ri-twitter-fill", 0),
    new Tile("Just text", "https://www.greenmanov.net/", "http://www.greenmanov.net/favicon.ico", 0),
    new Tile("Just text", "https://www.greenmanov.net/", "😅", 0),
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
