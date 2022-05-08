import { Component, Input, OnInit } from '@angular/core';
import { Tab } from '../../../data/shinobu/Tab';
import validator from 'validator';

@Component({
  selector: 'tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent implements OnInit {

  @Input()
  public tab?: Tab;

  @Input()
  public isActive: boolean = false;

  @Input()
  public isStandalone: boolean = false;

  @Input()
  public shake: boolean = false;

  public styles: any = {};

  constructor() {
  }

  ngOnInit(): void {
    if (this.shake) {
      const delay = Math.round(Math.random() * 100) / 1000;
      this.styles['animation-delay'] = `${delay}s`;
    }
  }

  public isImage(): boolean {
    const {icon} = this.tab || {};
    return !!icon && validator.isURL(icon, {
      require_tld: false,
      require_protocol: true
    });
  }

  public isIcon(): boolean {
    const {icon} = this.tab || {};
    return !!icon && icon.startsWith('ri-');
  }

  public getIconType(): string {
    if (this.isImage()) {
      return 'image';
    }
    if (this.isIcon()) {
      return 'icon';
    }
    return 'text';
  }

}
