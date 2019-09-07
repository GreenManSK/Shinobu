import { Component, ContentChild, Input, OnInit, TemplateRef } from '@angular/core';
import { BoxColor } from './box-color.enum';
import { BoxButton } from '../item-box/data/BoxButton';

@Component({
  selector: 'box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss']
})
export class BoxComponent implements OnInit {

  @Input()
  public color: BoxColor = BoxColor.Gray;

  @Input()
  public title: string;

  @Input()
  public icon = '';

  @ContentChild(TemplateRef, {static: false})
  @Input() contentTemplate: TemplateRef<any>;

  @Input()
  public headerButton: BoxButton;

  @Input()
  public onHeaderClick: () => void;

  constructor() {
  }

  public static getColorClass( color: BoxColor ): string {
    return ('' + BoxColor[color]).toLocaleLowerCase();
  }

  ngOnInit() {
  }

  public isImage( icon: string ): boolean {
    return icon.indexOf('/') >= 0;
  }

  public get colorClass() {
    return BoxComponent.getColorClass(this.color);
  }

  public headerButtonClick( event: MouseEvent ): void {
    event.preventDefault();
    this.headerButton.callback(null);
  }
}
