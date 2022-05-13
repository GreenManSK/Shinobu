import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnimeFormComponent } from '../anime-form/anime-form.component';
import { MusicFormComponent } from '../music-form/music-form.component';
import { ShowFormComponent } from '../show-form/show-form.component';
import { OvaFormComponent } from '../ova-form/ova-form.component';

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

  public isMusic(): boolean {
    return this.type === MusicFormComponent.TYPE;
  }

  public isShow(): boolean {
    return this.type === ShowFormComponent.TYPE;
  }

  public isOva(): boolean {
    return this.type === OvaFormComponent.TYPE;
  }

  public static getUrl( type: string, id?: string ): string {
    return 'index.html#/kirino-form/' + type + (id ? '/' + id : '');
  }

}
