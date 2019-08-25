import { Component, Input, OnInit } from '@angular/core';
import { ChromeMockStorageService } from '../../../mocks/chrome-mock-storage.service';
import { MessageService } from '../../../services/message.service';
import { BoxComponent } from '../box/box.component';
import { BoxColor } from '../box/box-color.enum';
import { SongService } from '../../services/song.service';
import { Song } from '../../types/song';
import { MusicBoxComponent } from '../music-box/music-box.component';
import { ActivatedRoute } from "@angular/router";

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

  public readonly color = BoxColor.Blue;
  private service: SongService;

  public _id: number;
  public song: Song;

  constructor(
    chromeStorage: ChromeMockStorageService,
    public messageService: MessageService,
    private route: ActivatedRoute,
  ) {
    this.service = new SongService(chromeStorage);
  }

  ngOnInit() {
  }

  @Input('id')
  public set id( id: number ) {
    this._id = id;
    if (id) {
      this.service.get(id).then(( song: Song ) => this.song = song);
    } else {
      this.song = new Song(
        this.route.snapshot.queryParams[MusicFormComponent.SHOW_PARAM],
        this.route.snapshot.queryParams[MusicFormComponent.TYPE_PARAM],
        this.route.snapshot.queryParams[MusicFormComponent.TITLE_PARAM],
        this.route.snapshot.queryParams[MusicFormComponent.AUTHOR_PARAM],
        this.route.snapshot.queryParams[MusicFormComponent.DATE_PARAM],
        this.route.snapshot.queryParams[MusicFormComponent.ANIDB_ID_PARAM],
        this.route.snapshot.queryParams[MusicFormComponent.ANISON_ID_PARAM],
      );
    }
  }

  public save(): void {
    this.service.save(this.song).then(() => {
      this.messageService.sendMessage(MusicBoxComponent.SYNC_KEY, 'reload');
      window.close();
    });
  }


  public get colorClass() {
    return BoxComponent.getColorClass(this.color);
  }

  public updateReleaseDate( date: string ): void {
    this.song.releaseDate = new Date(date).getTime();
  }

}
