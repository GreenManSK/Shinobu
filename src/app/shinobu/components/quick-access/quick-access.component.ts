import { Component, Input, OnInit } from '@angular/core';
import { Tab } from '../../types/tab';
import { ChromeMockStorageService } from '../../../mocks/chrome-mock-storage.service';
import { TabService } from '../../services/tab.service';
import { Tile } from "../../types/tile";
import { ShContextMenuClickEvent } from "../../../../../node_modules/ng2-right-click-menu/lib/sh-context-menu.models";

@Component({
  selector: 'quick-access',
  templateUrl: './quick-access.component.html',
  styleUrls: ['./quick-access.component.scss']
})
export class QuickAccessComponent implements OnInit {

  private _tab: Tab;
  private addTile = new Tile('Add', '#', 'plus');
  private activeTile: Tile;
  private showModal = false;
  private tabService: TabService;
  private oldOrder: Tile[] = [];

  constructor(
    chromeStorage: ChromeMockStorageService
  ) {
    this.tabService = new TabService(chromeStorage);
  }

  ngOnInit() {
  }

  @Input('tab')
  public set tab( tab: Tab ) {
    if (tab) {
      this.oldOrder = Object.assign([], tab.tiles);
    }
    this._tab = tab;
  }

  public get tab(): Tab {
    return this._tab;
  }

  public addNewTile( event: MouseEvent = null ): void {
    if (event) {
      event.preventDefault();
    }
    this.activeTile = new Tile('', '', '');
    this.showModal = true;
  }

  public editTile( event: ShContextMenuClickEvent ): void {
    this.activeTile = event.data as Tile;
    this.showModal = true;
  }

  public deleteTile( event: ShContextMenuClickEvent ): void {
    const tile = event.data as Tile;
    const index = this.tab.tiles.indexOf(tile, 0);
    if (index > -1) {
      this.tab.tiles.splice(index, 1);
    }
  }

  public saveOrder(): void {
    if (JSON.stringify(this.oldOrder) === JSON.stringify(this.tab.tiles)) {
      return;
    }
    this.oldOrder = Object.assign([], this.tab.tiles);
    this.tabService.save(this.tab);
  }
}