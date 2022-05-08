import { Component, ContentChild, Input, OnInit, TemplateRef } from '@angular/core';
import { Color } from '../../types/Color';

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

  public static getColorClass( color: Color ): string {
    return ('' + Color[color]).toLocaleLowerCase();
  }

}
