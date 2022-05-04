import { Component, Input, OnInit } from '@angular/core';
import { Tab } from '../../../data/shinobu/Tab';
import { Tile } from '../../../data/shinobu/Tile';
import { ShContextMenuClickEvent } from 'ng2-right-click-menu/lib/sh-context-menu.models';
import { TabService } from '../../../services/data/shinobu/tab.service';

@Component({
  selector: 'quick-access',
  templateUrl: './quick-access.component.html',
  styleUrls: ['./quick-access.component.scss']
})
export class QuickAccessComponent implements OnInit {

  public addTileButton = new Tile('Add', '#', 'ri-add-line', 0);
  public showModal = false;
  public activeTile?: Tile;
  public sorting = false;
  public sortableOptions = {
    onUpdate: () => this.saveOrder()
  };

  private oldOrder: Tile[] = [];
  private _tab?: Tab;

  constructor(private tabService: TabService) {
  }

  ngOnInit(): void {
  }

  @Input('tab')
  public set tab( tab: Tab | undefined ) {
    if (tab) {
      this.oldOrder = Object.assign([], tab.tiles);
    }
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

  public editTile( event: ShContextMenuClickEvent ): void {
    this.activeTile = event.data as Tile;
    this.showModal = true;
  }

  public deleteTile( event: ShContextMenuClickEvent ): void {
    if (!this.tab) {
      return;
    }
    const tile = event.data as Tile;
    const index = this.tab.tiles.indexOf(tile, 0);
    if (index > -1) {
      this.tab.tiles.splice(index, 1);
    }
    this.tabService.save(this.tab);
  }

  public toggleSort() {
    this.sorting = !this.sorting;
  }

  public saveOrder() {
    if (!this.tab || JSON.stringify(this.oldOrder) === JSON.stringify(this.tab.tiles)) {
      return;
    }
    this.tab.tiles.forEach((tile, index) => tile.order = index+1);
    this.oldOrder = Object.assign([], this.tab.tiles);
    this.tabService.save(this.tab);
  }
}
