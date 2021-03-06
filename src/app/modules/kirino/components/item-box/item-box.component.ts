import { ApplicationRef, Component, Input, OnInit } from '@angular/core';
import { BoxItem } from './data/BoxItem';
import { LocalPreferenceService } from '../../../../services/local-preference.service';
import { BoxColor } from '../box/box-color.enum';
import { BoxButton } from './data/BoxButton';

@Component({
  selector: 'item-box',
  templateUrl: './item-box.component.html',
  styleUrls: ['./item-box.component.scss']
})
export class ItemBoxComponent implements OnInit {

  private static readonly HIDDEN_KEYS = '_HIDDEN';

  @Input()
  public syncFunction: ( item: BoxItem ) => void;

  @Input()
  public localPreferenceKey: string;

  @Input()
  public color: BoxColor = BoxColor.Gray;

  @Input()
  public title: string;

  @Input()
  public icon: string = '';

  @Input()
  public enableHiding = false;

  @Input()
  public headerButton: BoxButton;

  private _items: BoxItem[];
  private hiddenKeys: Set<any>;
  public hiddenGroups: object;
  public renderedItems: BoxItem[] = [];
  public now: Date;
  public minimized = true;

  constructor(
    public localPreference: LocalPreferenceService,
    private ref: ApplicationRef
  ) {
    this.now = new Date();
  }

  ngOnInit() {
    this.localPreference.get(this.localPreferenceKey + ItemBoxComponent.HIDDEN_KEYS, []).then(keys => this.hiddenKeys = new Set<any>(keys));
  }

  @Input('items')
  public set items( items: BoxItem[] ) {
    this._items = items;
    this.prepareRenderedItems();
  }

  public syncItem( item: BoxItem ): void {
    this.syncFunction(item);
  }

  public hideItemGroup( item: BoxItem ): void {
    if (this.hiddenKeys.has(item.groupKey)) {
      this.hiddenKeys.delete(item.groupKey);
    } else {
      this.hiddenKeys.add(item.groupKey);
    }
    this.localPreference.set(this.localPreferenceKey + ItemBoxComponent.HIDDEN_KEYS, Array.from(this.hiddenKeys.values())).then(() => {
      this.prepareRenderedItems();
    });
  }

  public onHeaderClick(): void {
    this.minimized = !this.minimized;
    this.prepareRenderedItems();
  }

  public onButtonClicked( event: MouseEvent, item: BoxItem, button: BoxButton ): void {
    event.preventDefault();
    button.callback(item.data);
  }

  private prepareRenderedItems(): void {
    this.hiddenGroups = {};
    this.renderedItems = [...this._items]
      .sort(( a, b ) => {
        const diff = (a.date ? a.date.getTime() : Number.MAX_VALUE) - (b.date ? b.date.getTime() : Number.MAX_VALUE);
        if (diff === 0) {
          return a.title.localeCompare(b.title);
        }
        return diff;
      })
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
