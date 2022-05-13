import { Component, Input, OnInit } from '@angular/core';
import { Color } from '../../../types/Color';
import { ActivatedRoute } from '@angular/router';
import { SongService } from '../../../services/data/kirino/song.service';
import { Song } from '../../../data/kirino/Song';
import { Subscription } from 'rxjs';
import { BoxComponent } from '../../box/box.component';

@Component({
  selector: 'music-form',
  templateUrl: './music-form.component.html',
  styleUrls: ['./music-form.component.scss']
})
export class MusicFormComponent implements OnInit {

  public static readonly TYPE = 'music';
  public static readonly WIDTH = 600;
  public static readonly HEIGHT = 500;

  public static readonly SHOW_PARAM = 'show';
  public static readonly TYPE_PARAM = 'type';
  public static readonly TITLE_PARAM = 'title';
  public static readonly AUTHOR_PARAM = 'author';
  public static readonly DATE_PARAM = 'date';
  public static readonly ANIDB_ID_PARAM = 'anidbId';
  public static readonly ANISON_ID_PARAM = 'anisonId';

  public readonly color = Color.Blue;

  private _id: string = '';
  public song?: Song;

  constructor(
    private route: ActivatedRoute,
    private service: SongService
  ) {
  }

  ngOnInit(): void {
  }

  @Input('id')
  public set id( id: string ) {
    this._id = id;
    if (id) {
      this.service.onReady().then(() => {
        let subscription: Subscription;
        subscription = this.service.getById(id).subscribe(song => {
          this.song = song;
          subscription.unsubscribe();
        });
      });
    } else {
      this.song = new Song(
        this.route.snapshot.queryParams[MusicFormComponent.SHOW_PARAM],
        this.route.snapshot.queryParams[MusicFormComponent.TYPE_PARAM],
        this.route.snapshot.queryParams[MusicFormComponent.TITLE_PARAM],
        this.route.snapshot.queryParams[MusicFormComponent.AUTHOR_PARAM],
        +this.route.snapshot.queryParams[MusicFormComponent.DATE_PARAM],
        +this.route.snapshot.queryParams[MusicFormComponent.ANIDB_ID_PARAM],
        +this.route.snapshot.queryParams[MusicFormComponent.ANISON_ID_PARAM],
      );
    }
  }

  public save(): void {
    if (!this.song) {
      return;
    }
    this.service.save(this.song).then(() => {
      // TODO: Sync data
      window.close();
    });
  }

  public getColorClass() {
    return BoxComponent.getColorClass(this.color);
  }

  public updateReleaseDate( date: string ): void {
    if (!this.song) {
      return;
    }
    this.song.releaseDate = new Date(date).getTime();
  }
}
