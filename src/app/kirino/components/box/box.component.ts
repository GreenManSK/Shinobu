import {Component, Input, OnInit} from '@angular/core';
import {Note} from '../../../shinobu/types/note';
import {BoxItem} from './data/BoxItem';
import {LocalPreferenceService} from '../../../services/local-preference.service';

@Component({
  selector: 'box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss']
})
export class BoxComponent implements OnInit {

  @Input()
  public syncFunction: (item: BoxItem) => void;

  private _items: BoxItem[];
  private renderedItems: BoxItem[] = [];

  constructor(
    public localPreference: LocalPreferenceService
  ) {
    // TODO: Local storage for saving hidden?
  }

  ngOnInit() {
  }

  @Input('items')
  public set items(items: BoxItem[]) {
    this._items = items;
    this.prepareRenderedItems();
  }

  public syncItem(item: BoxItem): void {
    this.syncFunction(item);
  }

  public hideItemGroup(item: BoxItem): void {

  }

  private prepareRenderedItems(): void {
    this.renderedItems = this._items
      .filter(i => true) // TODO: Filter hidden
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }
}
