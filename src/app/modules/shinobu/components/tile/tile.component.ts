import { Component, Input, OnInit } from '@angular/core';
import { Tile } from '../../types/tile';
import validator from 'validator';

@Component({
  selector: 'tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent implements OnInit {

  @Input()
  public tile: Tile;

  constructor() { }

  ngOnInit() {
  }

  public isImage( icon: string ): boolean {
    return validator.isURL(icon);
  }
}
