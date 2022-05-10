import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Tab } from '../../../data/shinobu/Tab';
import { TabService } from '../../../services/data/shinobu/tab.service';
import { LocalPreferenceService } from '../../../services/data/local-preference.service';
import { ShContextMenuClickEvent } from 'ng2-right-click-menu/lib/sh-context-menu.models';

@Component({
  selector: 'tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit, OnDestroy {

  private static readonly ACTIVE_TAB_KEY = 'activeTab';

  @Output()
  public tabChanged = new EventEmitter<Tab>();

  public tabs: Tab[] = [];
  public activeTab?: Tab;

  public showModal = false;
  public editedTab?: Tab;

  public sorting = false;
  public sortableOptions = {
    onUpdate: () => this.saveOrder()
  };
  public sortingTab = new Tab('Stop sorting', 'ri-close-circle-line');

  private oldOrder: Tab[] = [];

  private tabsUnsubscribe?: () => void;

  constructor( private tabService: TabService, private localPreferenceService: LocalPreferenceService ) {
  }

  ngOnInit(): void {
    this.tabService.onReady().then(() => this.prepareTabs())
  }

  ngOnDestroy() {
    this.tabsUnsubscribe && this.tabsUnsubscribe();
  }

  public switchTab( tab: Tab ) {
    this.setActiveTab(tab);
  }

  public addTab() {
    this.editedTab = new Tab('', '', [], this.tabs.length + 1)
    this.showModal = true;
  }

  private prepareTabs() {
    this.tabsUnsubscribe = this.tabService.getAll().subscribe(tabs => {
      this.tabs = tabs;
      this.oldOrder = Object.assign([], tabs);
      if (this.tabs.length <= 0) {
        this.tabs = [new Tab('default', 'ri-home-heart-fill', [])];
        return
      }
      const activeTabId = this.localPreferenceService.get(TabsComponent.ACTIVE_TAB_KEY, 0);
      const activeTabCandidates = this.tabs.filter(tab => tab.id === activeTabId);
      this.setActiveTab(activeTabCandidates.length > 0 ? activeTabCandidates[0] : this.tabs[0]);
    }).unsubscribe;
  }

  private setActiveTab( tab: Tab ) {
    if (tab.id) {
      this.localPreferenceService.save(TabsComponent.ACTIVE_TAB_KEY, tab.id);
    }
    this.activeTab = tab;
    this.tabChanged.emit(this.activeTab);
  }

  public editTab( event: ShContextMenuClickEvent ) {
    this.editedTab = event.data as Tab;
    this.showModal = true;
  }

  public deleteTab( event: ShContextMenuClickEvent ) {
    const tab = event.data as Tab;
    if (confirm(`Do you really want to delete ${tab.title}?`)) {
      this.tabService.delete(tab);
    }
  }

  public toggleSort() {
    this.sorting = !this.sorting;
  }

  private saveOrder() {
    if (JSON.stringify(this.oldOrder) === JSON.stringify(this.tabs)) {
      return;
    }
    this.tabs.forEach(( tab, index ) => tab.order = index + 1);
    this.oldOrder = Object.assign([], this.tabs);
    const tabs = this.oldOrder
    tabs.forEach(tab => this.tabService.save(tab));
  }
}
