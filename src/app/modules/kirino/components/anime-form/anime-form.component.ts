import { Component, Input, OnInit } from '@angular/core';
import { BoxColor } from '../box/box-color.enum';
import { Anime } from '../../types/anime';
import { AnimeService } from '../../services/anime.service';
import { ChromeMockStorageService } from '../../../../mocks/chrome-mock-storage.service';
import { BoxComponent } from '../box/box.component';
import { MessageService } from '../../../../services/message.service';
import { AnimeBoxComponent } from '../anime-box/anime-box.component';
import { ActivatedRoute } from '@angular/router';
import { ErrorService } from '../../../../services/error.service';

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

  public readonly color = BoxColor.Red;

  public _id: number;
  public anime: Anime;

  constructor(
    public messageService: MessageService,
    private route: ActivatedRoute,
    private service: AnimeService,
    errorService: ErrorService
  ) {
  }

  ngOnInit() {
  }

  @Input('id')
  public set id( id: number ) {
    this._id = id;
    if (id) {
      this.service.get(id).then(( anime: Anime ) => this.anime = anime);
    } else {
      this.anime = new Anime(
        this.route.snapshot.queryParams[AnimeFormComponent.TITLE_PARAM],
        +this.route.snapshot.queryParams[AnimeFormComponent.ANIDB_ID_PARAM]
      );
    }
  }

  public save(): void {
    this.service.save(this.anime).then(() => {
      this.messageService.sendMessage(AnimeBoxComponent.SYNC_KEY, 'reload');
      window.close();
    });
  }

  public get colorClass() {
    return BoxComponent.getColorClass(this.color);
  }
}
