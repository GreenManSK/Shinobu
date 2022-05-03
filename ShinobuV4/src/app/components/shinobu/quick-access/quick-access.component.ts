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
  public addTileButton = new Tile('Add', '#', 'ri-add-line', 0);
  public showModal = false;
  public activeTile?: Tile;

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

  public addTile(event?: MouseEvent): void {
    if (event) {
      event.preventDefault();
    }
    this.activeTile = new Tile('', '', '', 1 + (this.tab?.tiles?.length || 0));
    this.showModal = true;
  }
}
