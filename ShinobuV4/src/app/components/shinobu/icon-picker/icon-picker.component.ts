import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { remixIconData } from './remix-icon-data';


@Component({
  selector: 'icon-picker',
  templateUrl: './icon-picker.component.html',
  styleUrls: ['./icon-picker.component.scss']
})
export class IconPickerComponent implements OnInit {

  @Output() onIconPick = new EventEmitter<string>();

  public activeSection?: string;
  public sectionHeaders: { name: string, icon: string }[] = [];
  public sectionIcons: { name: string, class: string }[][] = [];

  constructor() {
  }

  ngOnInit(): void {
    remixIconData.forEach(( {name, icon} ) => {
      this.sectionHeaders.push({
        name,
        icon
      })
    });
    this.setActiveSection(this.sectionHeaders[0].name);
  }

  public setActiveSection( name: string ) {
    this.activeSection = name;
    if (name === 'search') {
      this.search();
      return;
    }
    this.sectionIcons = remixIconData.filter(section => section.name === name)[0].icons || [];
  }

  public sendIconData(icon: string) {
    this.onIconPick.emit(icon);
  }

  public search(searchText = "") {
    this.sectionIcons = [];
    if (searchText === "") {
      return;
    }
    remixIconData.forEach(section => {
      section.icons.forEach(icon => {
        if (icon[0].name.startsWith(searchText)) {
          this.sectionIcons.push(icon);
        }
      });
    })
  }
}
