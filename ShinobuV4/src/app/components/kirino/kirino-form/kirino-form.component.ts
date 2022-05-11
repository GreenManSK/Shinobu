import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnimeFormComponent } from '../anime-form/anime-form.component';

@Component({
  selector: 'app-kirino-form',
  templateUrl: './kirino-form.component.html',
  styleUrls: ['./kirino-form.component.scss']
})
export class KirinoFormComponent implements OnInit {

  public id: string = '';
  private type: string = '';

  constructor( private route: ActivatedRoute ) {
  }

  ngOnInit(): void {
    ({id: this.id, type: this.type} = this.route.snapshot.params);
  }

  public isAnime(): boolean {
    return this.type === AnimeFormComponent.TYPE;
  }

  public static getUrl( type: string, id?: number ): string {
    return 'index.html#/kirino-form/' + type + (id ? '/' + id : '');
  }

}
