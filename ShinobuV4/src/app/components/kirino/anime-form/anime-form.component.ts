import { Component, Input, OnInit } from '@angular/core';
import { Color } from '../../../types/Color';
import { AnimeService } from '../../../services/data/kirino/anime.service';
import { ActivatedRoute } from '@angular/router';
import { Anime } from '../../../data/kirino/Anime';
import { Subscription } from 'rxjs';
import { BoxComponent } from '../../box/box.component';

@Component({
  selector: 'anime-form',
  templateUrl: './anime-form.component.html',
  styleUrls: ['./anime-form.component.scss']
})
export class AnimeFormComponent implements OnInit {

  public static readonly TYPE = 'anime';
  public static readonly WIDTH = 600;
  public static readonly HEIGHT = 500;

  public static readonly TITLE_PARAM = 'title';
  public static readonly ANIDB_ID_PARAM = 'anidbId';

  public readonly color = Color.Red;


  private _id: string = '';
  public anime?: Anime;

  constructor(
    private route: ActivatedRoute,
    private service: AnimeService ) {
  }

  ngOnInit(): void {
  }


  @Input('id')
  public set id( id: string ) {
    this._id = id;
    if (id) {
      let subscription: Subscription;
      subscription = this.service.getById(id).subscribe(anime => {
        this.anime = anime;
        subscription.unsubscribe();
      })
    } else {
      this.anime = new Anime(
        this.route.snapshot.queryParams[AnimeFormComponent.TITLE_PARAM],
        +this.route.snapshot.queryParams[AnimeFormComponent.ANIDB_ID_PARAM]
      );
    }
  }

  public save(): void {
    if (!this.anime) {
      return;
    }
    this.service.save(this.anime).then(() => {
      // TODO: Sync data
      window.close();
    });
  }


  public getColorClass() {
    return BoxComponent.getColorClass(this.color);
  }
}
