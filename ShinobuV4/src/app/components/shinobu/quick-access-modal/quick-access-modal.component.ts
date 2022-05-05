import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tab } from '../../../data/shinobu/Tab';
import { Tile } from '../../../data/shinobu/Tile';
import { TabService } from '../../../services/data/shinobu/tab.service';

@Component({
  selector: 'quick-access-modal',
  templateUrl: './quick-access-modal.component.html',
  styleUrls: ['./quick-access-modal.component.scss']
})
export class QuickAccessModalComponent implements OnInit {

  private _tab?: Tab;

  public _tile?: Tile;

  @Input()
  public visible = true;

  @Output()
  public visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  public title: string = '';
  public url: string = '';
  public icon: string = '';

  public emojiPickerTheme = {
    martShowHeader: true,
    martShowFooter: false,
    martHeaderPadding: {x: '0px', y: '0px'},
    martHeaderBG: '#e3e7e8',
    martBG: '#ffffff',
    martCategoryColor: '#94a0a6',
    martCategoryColorActive: '#455a64',
    martActiveCategoryIndicatorColor: '#00897b',
    martEmojiFontSize: '150%',
    martCategoryFontSize: '20px',
    martBorderRadius: '10px',
    martActiveCategoryIndicatorHeight: '4px',
    martEmojiPadding: {x: '40px', y: '40px'}
  };

  public showEmojiPicker = false;
  public showIconPicker = false;

  constructor( private tabService: TabService ) {
  }

  ngOnInit(): void {
  }

  @Input('tab')
  set tab( value: Tab | undefined ) {
    this._tab = value;
    this.showEmojiPicker = false;
    this.showIconPicker = false;
    this.updateValues();
  }

  get tab() {
    return this._tab;
  }

  @Input('tile')
  set tile( value: Tile | undefined ) {
    this._tile = value;
    this.updateValues();
  }

  get tile() {
    return this._tile;
  }

  public get editItem(): Tab | Tile | undefined {
    return this.tile ? this.tile : this.tab;
  }

  public get previewTile(): Tile {
    return new Tile(this.title, this.url, this.icon, 0);
  }

  public get previewTab(): Tab {
    return new Tab(this.title, this.icon, [], 0);
  }

  private updateValues(): void {
    const editItem = this.editItem;
    if (!editItem) {
      return;
    }
    if (editItem.title !== null) {
      this.title = editItem.title;
    }
    if (editItem.icon !== null) {
      this.icon = editItem.icon;
    }
    this.url = this.tile ? this.tile.link : '';
  }

  public hide(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.updateValues();
  }

  public save(): void {
    const editItem = this.editItem;
    if (!editItem || !this._tab) {
      return;
    }
    editItem.title = this.title;
    editItem.icon = this.icon;
    if (this.url && this.tile) {
      this.tile.link = this.url;
    }
    if (this._tile && this._tab.tiles.indexOf(this._tile) < 0) {
      this._tab.tiles.push(this._tile);
    }
    this.tabService.save(this._tab).then(() => this.hide());
  }

  public handleEmoji( event: any ): void {
    this.icon = event.char;
  }

  public handleIcon( icon: string ) {
    this.icon = icon;
  }

  public toggleEmoji() {
    this.showEmojiPicker = !this.showEmojiPicker;
    this.showIconPicker = false;
  }

  public toggleIcon() {
    this.showIconPicker = !this.showIconPicker;
    this.showEmojiPicker = false;
  }
}
