import {Component, Input, OnInit} from '@angular/core';
import {BoxItem} from './data/BoxItem';
import {LocalPreferenceService} from '../../../services/local-preference.service';
import {BoxColor} from './box-color.enum';

@Component({
  selector: 'box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss']
})
export class BoxComponent implements OnInit {

  private static readonly HIDDEN_KEYS = '_HIDDEN';

  @Input()
  public syncFunction: (item: BoxItem) => void;

  @Input()
  public localPreferenceKey: string;

  @Input()
  public color: BoxColor = BoxColor.Gray;

  @Input()
  public enableHiding = false;

  private _items: BoxItem[];
  private hiddenKeys: Set<any>;
  private hiddenGroups: object;
  private renderedItems: BoxItem[] = [];

  constructor(
    public localPreference: LocalPreferenceService
  ) {
  }

  ngOnInit() {
    this.localPreference.get(this.localPreferenceKey + BoxComponent.HIDDEN_KEYS, []).then(keys => this.hiddenKeys = new Set<any>(keys));
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
    if (this.hiddenKeys.has(item.groupKey)) {
      this.hiddenKeys.delete(item.groupKey);
    } else {
      this.hiddenKeys.add(item.groupKey);
    }
    this.localPreference.set(this.localPreferenceKey + BoxComponent.HIDDEN_KEYS, Array.from(this.hiddenKeys.values())).then(() => {
      this.prepareRenderedItems();
    });
  }

  private prepareRenderedItems(): void {
    this.hiddenGroups = {};
    this.renderedItems = [...this._items]
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .filter(i => {
        if (!this.hiddenKeys.has(i.groupKey)) {
          return true;
        }
        if (!this.hiddenGroups.hasOwnProperty(i.groupKey)) {
          this.hiddenGroups[i.groupKey] = [];
          return true;
        }
        this.hiddenGroups[i.groupKey].push(i);
        return false;
      });
  }
}
