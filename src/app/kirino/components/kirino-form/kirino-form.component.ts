import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnimeFormComponent } from '../anime-form/anime-form.component';
import { ShowFormComponent } from '../show-form/show-form.component';
import { OvaFormComponent } from '../ova-form/ova-form.component';

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

  public static getUrl( type: string, id: number = null ): string {
    return 'index.html#/kirino-form/' + type + (id ? '/' + id : '');
  }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.type = this.route.snapshot.params.type;
  }

  public isAnime(): boolean {
    return this.type === AnimeFormComponent.TYPE;
  }

  public isShow(): boolean {
    return this.type === ShowFormComponent.TYPE;
  }

  public isOva(): boolean {
    return this.type === OvaFormComponent.TYPE;
  }
}
