import { Component, Input, OnInit } from '@angular/core';
import { Tab } from '../../../data/shinobu/Tab';
import { Tile } from '../../../data/shinobu/Tile';

@Component({
  selector: 'quick-access',
  templateUrl: './quick-access.component.html',
  styleUrls: ['./quick-access.component.scss']
})
export class QuickAccessComponent implements OnInit {

  private _tab?: Tab;
  public addTile = new Tile('Add', '#', 'ri-add-line', 0);

  constructor() {
  }

  ngOnInit(): void {
  }

  @Input('tab')
  public set tab( tab: Tab | undefined ) {
    this._tab = tab;
  }

  public get tab(): Tab | undefined {
    return this._tab;
  }

}
