import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Tab } from '../../types/tab';
import { Tile } from '../../types/tile';
import { TabService } from '../../services/tab.service';

@Component({
  selector: 'quick-access-modal',
  templateUrl: './quick-access-modal.component.html',
  styleUrls: ['./quick-access-modal.component.scss']
})
export class QuickAccessModalComponent implements OnInit {

  private _tab: Tab;

  public _tile: Tile;

  @Input()
  public service: TabService;

  @Input()
  public visible = true;

  @Output()
  public visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('background', {static: false})
  public backgroundElement: ElementRef;

  public title: string;
  public url: string;
  public icon: string;

  constructor() {
  }

  ngOnInit() {
  }

  @Input('tab')
  set tab( value: Tab ) {
    this._tab = value;
    this.updateValues();
  }

  get tab() {
    return this._tab;
  }

  @Input('tile')
  set tile( value: Tile ) {
    this._tile = value;
    this.updateValues();
  }

  get tile() {
    return this._tile;
  }

  public get editItem(): Tab | Tile {
    return this.tile ? this.tile : this._tab;
  }

  public hide(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.updateValues();
  }

  public save(): void {
    const editItem = this.editItem;
    editItem.title = this.title;
    editItem.icon = this.icon;
    if (this.url) {
      this.tile.link = this.url;
    }
    this.service.save(this._tab).then(() => this.hide());
  }

  private updateValues(): void {
    const editItem = this.editItem;
    this.title = editItem.title;
    this.icon = editItem.icon;
    this.url = this.tile ? this.tile.link : null;
  }
}
