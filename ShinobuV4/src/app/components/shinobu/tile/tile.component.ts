import { Component, Input, OnInit } from '@angular/core';
import { Tile } from '../../../data/shinobu/Tile';
import validator from 'validator';

@Component({
  selector: 'tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent implements OnInit {

  @Input()
  public tile?: Tile;

  @Input()
  public shake: boolean = false;

  public styles: any = {};

  constructor() {
  }

  ngOnInit() {
    if (this.shake) {
      const delay = Math.round(Math.random() * 100) / 1000;
      this.styles["animation-delay"] = `${delay}s`;
    }
  }

  public isImage(): boolean {
    const {icon} = this.tile || {};
    return !!icon && validator.isURL(icon, {
      require_tld: false,
      require_protocol: true
    });
  }

  public isIcon(): boolean {
    const {icon} = this.tile || {};
    return !!icon && icon.startsWith('ri-');
  }

  public getIconType(): string {
    if (this.isImage()) {
      return "image";
    }
    if (this.isIcon()) {
      return "icon";
    }
    return "text";
  }
}
