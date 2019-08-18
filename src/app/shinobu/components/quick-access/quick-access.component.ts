import { Component, Input, OnInit } from '@angular/core';
import { Tab } from '../../types/tab';
import { ChromeMockStorageService } from '../../../mocks/chrome-mock-storage.service';
import { TabService } from '../../services/tab.service';
import { Tile } from "../../types/tile";

@Component({
  selector: 'quick-access',
  templateUrl: './quick-access.component.html',
  styleUrls: ['./quick-access.component.scss']
})
export class QuickAccessComponent implements OnInit {

  @Input()
  public tab: Tab;

  private addTile = new Tile('Add', '#', 'plus');
  private activeTile: Tile;
  private showModal = false;
  private tabService: TabService;

  constructor(
    chromeStorage: ChromeMockStorageService
  ) {
    this.tabService = new TabService(chromeStorage);
  }

  ngOnInit() {
  }

  public addNewTile(event: MouseEvent): void {
    event.preventDefault();
    this.activeTile = new Tile('', '', '');
    this.showModal = true;
  }
}
