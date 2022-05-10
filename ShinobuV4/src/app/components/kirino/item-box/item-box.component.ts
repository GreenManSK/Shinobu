import { Component, Input, OnInit } from '@angular/core';
import { Color } from '../../../types/Color';
import { BoxItem } from '../../../types/kirino/BoxItem';
import { BoxButton } from '../../../types/kirino/BoxButton';
import { LocalPreferenceService } from '../../../services/data/local-preference.service';

@Component({
  selector: 'item-box',
  templateUrl: './item-box.component.html',
  styleUrls: ['./item-box.component.scss']
})
export class ItemBoxComponent implements OnInit {

  private static readonly HIDDEN_KEYS = '_HIDDEN';

  @Input()
  public color: Color = Color.Gray;

  @Input()
  public title: string = '';

  @Input()
  public icon: string = '';

  @Input()
  public localPreferenceKey?: string;

  @Input()
  public enableHiding = false;

  @Input()
  public headerButtons: BoxButton[] = [];

  public now: Date;
  public minimized = true;
  public hiddenGroups: { [key: string]: number } = {};
  public renderItems: BoxItem[] = [];

  private _items: BoxItem[] = [];
  private _hiddenKyes: Set<string> = new Set<string>();

  constructor( private localPreferenceService: LocalPreferenceService ) {
    this.now = new Date();
  }

  ngOnInit(): void {
    if (this.enableHiding) {
      this._hiddenKyes = new Set<string>(this.localPreferenceService.get(`${this.localPreferenceKey}${ItemBoxComponent.HIDDEN_KEYS}`, []));
    }
  }

  @Input('items')
  public set items( items: BoxItem[] ) {
    this._items = items;
    this.prepareRenderedItems();
  }

  public onHeaderClick(): void {
    this.minimized = !this.minimized;
  }

  public toggleHideItem( item: BoxItem ): void {
    if (!this.enableHiding) {
      return;
    }
    if (this._hiddenKyes.has(item.groupKey)) {
      this._hiddenKyes.delete(item.groupKey);
    } else {
      this._hiddenKyes.add(item.groupKey);
    }
    this.prepareRenderedItems();
  }

  public onButtonClicked( event: MouseEvent, item: BoxItem, button: BoxButton ): void {
    event.preventDefault();
    button.callback && button.callback(item.data);
  }

  private prepareRenderedItems(): void {
    this.hiddenGroups = {};
    this.renderItems = [...this._items]
      .sort(( a, b ) => {
        const diff = (a.date ? a.date.getTime() : Number.MAX_VALUE) - (b.date ? b.date.getTime() : Number.MAX_VALUE);
        if (diff === 0) {
          return a.title.localeCompare(b.title);
        }
        return diff;
      })
      .filter(item => {
        const groupKey = `${item.groupKey}`;
        if (!this._hiddenKyes.has(groupKey)) {
          return true;
        }
        if (!this.hiddenGroups.hasOwnProperty(groupKey)) {
          this.hiddenGroups[groupKey] = 0;
          return true;
        }
        this.hiddenGroups[groupKey] += 1;
        return false;
      });
  }
}
