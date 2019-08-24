import { Component, ContentChild, Input, OnInit, TemplateRef } from '@angular/core';
import { BoxColor } from './box-color.enum';

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

  constructor() {
  }

  ngOnInit() {
  }

  public isImage( icon: string ): boolean {
    return icon.indexOf('/') >= 0;
  }

  public get colorClass() {
    return ('' + BoxColor[this.color]).toLocaleLowerCase();
  }

}
