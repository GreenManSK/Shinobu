import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'kirino-form',
  templateUrl: './kirino-form.component.html',
  styleUrls: ['./kirino-form.component.scss']
})
export class KirinoFormComponent implements OnInit {

  public id: number;
  public type: string;

  constructor( private route: ActivatedRoute ) {
  }

  public static getUrl( type: string, id: number ): string {
    return 'index.html#/kirino-form/' + type + (id ? '/' + id : '');
  }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.type = this.route.snapshot.params.type;
  }
}
