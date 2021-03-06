import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Tab } from '../../types/tab';
import { TabService } from '../../services/tab.service';
import { LocalPreferenceService } from '../../../../services/local-preference.service';
import validator from 'validator';
import { ShContextMenuClickEvent } from 'ng2-right-click-menu/lib/sh-context-menu.models';

@Component({
  selector: 'tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {

  private static readonly ACTIVE_TAB_KEY = 'activeTab';

  @Output()
  public tabChanged = new EventEmitter<Tab>();

  public tabs: Tab[];
  public activeTab: Tab;

  public showModal = false;
  public editedTab: Tab;

  constructor(
    public localPreference: LocalPreferenceService,
    public tabService: TabService
  ) {
  }

  ngOnInit() {
    this.tabService.getAll().then(( tabs ) => {
      this.tabs = tabs as Tab[];
      if (!this.tabs || this.tabs.length <= 0) {
        return this.createTab();
      }
      return Promise.resolve(this.tabs[0]);
    }).then(() => {
      return this.localPreference.get(TabsComponent.ACTIVE_TAB_KEY, 0);
    }).then(( activeNoteKey ) => {
      this.activeTab = this.tabs.filter(( n ) => n.id === activeNoteKey)[0];
      if (!this.activeTab) {
        this.activeTab = this.tabs[0];
      }
      this.tabChanged.emit(this.activeTab);
    });
  }

  public addTab(): void {
    this.createTab().then(( tab ) => this.activeTab = tab);
  }

  public editTab( event: ShContextMenuClickEvent ): void {
    this.editedTab = event.data as Tab;
    this.showModal = true;
  }

  public changeActiveTab( tab: Tab ): void {
    this.activeTab = tab;
    this.localPreference.set(TabsComponent.ACTIVE_TAB_KEY, tab.id);
    this.tabChanged.emit(tab);
  }

  public deleteTab( event: ShContextMenuClickEvent ): void {
    const tab = event.data as Tab;
    if (this.tabs.length <= 1) {
      return;
    }
    this.tabService.delete(tab).then(() => {
      const index = this.tabs.indexOf(tab, 0);
      if (index > -1) {
        this.tabs.splice(index, 1);
      }
      if (this.activeTab === tab) {
        this.changeActiveTab(this.tabs[0]);
      }
    });
  }

  public isImage( icon: string ): boolean {
    return validator.isURL(icon);
  }

  private createTab(): Promise<Tab> {
    const tab = new Tab('Tab ' + Date.now(), 'th-large');
    return this.tabService.save(tab).then(() => {
      this.tabs.push(tab);
      return tab;
    });
  }
}
