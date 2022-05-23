import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Color } from '../../../types/Color';
import { BoxItem } from '../../../types/kirino/BoxItem';
import { BoxButton } from '../../../types/kirino/BoxButton';
import { LocalPreferenceService } from '../../../services/data/local-preference.service';
import { InternetConnectionService } from '../../../services/internet-connection.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'item-box',
  templateUrl: './item-box.component.html',
  styleUrls: ['./item-box.component.scss']
})
export class ItemBoxComponent implements OnInit, OnDestroy {

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

  @Input()
  public syncFunction?: ( item: BoxItem ) => void;

  public now: Date;
  public minimized = true;
  public hiddenGroups: { [key: string]: number } = {};
  public renderItems: BoxItem[] = [];
  public isOnline = false;

  private _items: BoxItem[] = [];
  private _hiddenKyes: Set<string> = new Set<string>();
  private internetSubscription?: Subscription;

  constructor( private localPreferenceService: LocalPreferenceService, private internetConnectionService: InternetConnectionService ) {
    this.now = new Date();
  }

  ngOnInit(): void {
    if (this.enableHiding) {
      this._hiddenKyes = new Set<string>(this.localPreferenceService.get(`${this.localPreferenceKey}${ItemBoxComponent.HIDDEN_KEYS}`, []));
    }
    this.internetSubscription = this.internetConnectionService.asObservable().subscribe(connected => {
      this.isOnline = connected;
    });
  }

  ngOnDestroy(): void {
    this.internetSubscription?.unsubscribe();
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
    this.localPreferenceService.set(`${this.localPreferenceKey}${ItemBoxComponent.HIDDEN_KEYS}`, Array.from(this._hiddenKyes));
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
          return this._items.indexOf(a) - this._items.indexOf(b);
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
