import { Component, ContentChild, Input, OnInit, TemplateRef } from '@angular/core';
import { Color } from '../../types/Color';
import { BoxButton } from '../../types/kirino/BoxButton';

@Component({
  selector: 'box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss']
})
export class BoxComponent implements OnInit {

  @Input()
  public color = Color.Gray;

  @Input()
  public title = '';

  @Input()
  public icon = '';

  @Input()
  public headerButtons: BoxButton[] = [];

  @Input()
  public onHeaderClick?: () => void;

  @ContentChild(TemplateRef, {static: false})
  public contentTemplate: TemplateRef<any>;

  constructor() {
  }

  ngOnInit(): void {
  }

  public isImage( icon: string ): boolean {
    return icon.indexOf('/') >= 0;
  }

  public get colorClass() {
    return BoxComponent.getColorClass(this.color);
  }

  public headerButtonClick( event: MouseEvent, button: BoxButton ): boolean {
    event.preventDefault();
    event.stopPropagation();
    if (!button?.callback) {
      return false;
    }
    button.callback(null);
    return false;
  }

  public static getColorClass( color: Color ): string {
    return ('' + Color[color]).toLocaleLowerCase();
  }

}
