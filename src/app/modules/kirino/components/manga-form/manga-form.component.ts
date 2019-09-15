import { Component, Input, OnInit } from '@angular/core';
import { BoxColor } from '../box/box-color.enum';
import { Manga } from '../../types/manga';
import { MessageService } from '../../../../services/message.service';
import { ActivatedRoute } from '@angular/router';
import { MangaService } from '../../services/manga.service';
import { MangaBoxComponent } from '../manga-box/manga-box.component';
import { BoxComponent } from '../box/box.component';

@Component({
  selector: 'manga-form',
  templateUrl: './manga-form.component.html',
  styleUrls: ['./manga-form.component.scss']
})
export class MangaFormComponent implements OnInit {

  public static readonly TYPE = 'manga';
  public static readonly WIDTH = 600;
  public static readonly HEIGHT = 500;

  public static readonly TITLE_PARAM = 'title';
  public static readonly AMAZON_ID_PARAM = 'amazonId';
  public static readonly LAST_READ_PARAM = 'last_read';

  public readonly color = BoxColor.Orange;

  public _id: number;
  public manga: Manga;

  constructor(
    public messageService: MessageService,
    private route: ActivatedRoute,
    private service: MangaService
  ) {

  }
  ngOnInit() {
  }

  @Input('id')
  public set id( id: number ) {
    this._id = id;
    if (id) {
      this.service.get(id).then(( manga: Manga ) => this.manga = manga);
    } else {
      this.manga = new Manga(
        this.route.snapshot.queryParams[MangaFormComponent.TITLE_PARAM],
        this.route.snapshot.queryParams[MangaFormComponent.AMAZON_ID_PARAM],
        +this.route.snapshot.queryParams[MangaFormComponent.LAST_READ_PARAM],
      );
    }
  }

  public save(): void {
    this.service.save(this.manga).then(() => {
      this.messageService.sendMessage(MangaBoxComponent.SYNC_KEY, 'reload');
      window.close();
    });
  }

  public get colorClass() {
    return BoxComponent.getColorClass(this.color);
  }

}
