import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Tab} from '../../../data/shinobu/Tab';
import {TabService} from '../../../services/data/shinobu/tab.service';
import {LocalPreferenceService} from '../../../services/data/local-preference.service';
import {ShContextMenuClickEvent} from "ng2-right-click-menu/lib/sh-context-menu.models";

@Component({
  selector: 'tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {

  private static readonly ACTIVE_TAB_KEY = 'activeTab';

  @Output()
  public tabChanged = new EventEmitter<Tab>();

  public tabs: Tab[] = [];
  public activeTab?: Tab;

  public showModal = false;
  public editedTab?: Tab;

  constructor(private tabService: TabService, private localPreferenceService: LocalPreferenceService) {
  }

  ngOnInit(): void {
    this.tabService.onReady().then(() => this.prepareTabs())
  }

  public switchTab(tab: Tab) {
    this.setActiveTab(tab);
  }

  public addTab() {
    this.editedTab = new Tab('', '', [], this.tabs.length + 1)
    this.showModal = true;
  }

  private prepareTabs() {
    this.tabService.getAll().subscribe(tabs => {
      this.tabs = tabs;
      if (this.tabs.length <= 0) {
        this.tabService.save(new Tab('default', 'ri-home-heart-fill', []))
        return
      }
      const activeTabId = this.localPreferenceService.get(TabsComponent.ACTIVE_TAB_KEY, 0);
      const activeTabCandidates = this.tabs.filter(tab => tab.id === activeTabId);
      this.setActiveTab(activeTabCandidates.length > 0 ? activeTabCandidates[0] : this.tabs[0]);
    })
  }

  private setActiveTab(tab: Tab) {
    this.localPreferenceService.save(TabsComponent.ACTIVE_TAB_KEY, tab.id);
    this.activeTab = tab;
    this.tabChanged.emit(this.activeTab);
  }

  public editTab(event: ShContextMenuClickEvent) {
    this.editedTab = event.data as Tab;
    this.showModal = true;
  }

  public deleteTab(event: ShContextMenuClickEvent) {
    const tab = event.data as Tab;
    this.tabService.delete(tab);
  }
}
