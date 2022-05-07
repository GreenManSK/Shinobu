import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Color } from '../../../types/Color';

@Component({
  selector: 'color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements OnInit {

  @Output()
  public colorPicked: EventEmitter<Color> = new EventEmitter<Color>();

  constructor() {
  }

  ngOnInit(): void {
  }

  public colorValues(): string[] {
    const names = [];
    for (const n in Color) {
      if (typeof Color[n] === 'number') {
        names.push(n);
      }
    }
    return names;
  }

  public changeColor( color: any ): void {
    const enumColor: any = Color[color];
    this.colorPicked.emit(enumColor);
  }

}
