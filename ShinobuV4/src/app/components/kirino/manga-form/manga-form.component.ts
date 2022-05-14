import { Component, Input, OnInit } from '@angular/core';
import { Color } from '../../../types/Color';
import { Manga } from '../../../data/kirino/Manga';
import { ActivatedRoute } from '@angular/router';
import { MangaService } from '../../../services/data/kirino/manga.service';
import { BoxComponent } from '../../box/box.component';
import { Subscription } from 'rxjs';
import { MangaSyncService } from '../../../services/sync/kirino/manga-sync.service';

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

  public readonly color = Color.Purple;

  private _id: string = '';
  public manga?: Manga;

  constructor(
    private route: ActivatedRoute,
    private service: MangaService,
    private sync: MangaSyncService
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
        subscription = this.service.getById(id).subscribe(manga => {
          this.manga = manga;
          subscription.unsubscribe();
        });
      });
    } else {
      this.manga = new Manga(
        this.route.snapshot.queryParams[MangaFormComponent.TITLE_PARAM],
        this.route.snapshot.queryParams[MangaFormComponent.AMAZON_ID_PARAM],
        [],
        this.route.snapshot.queryParams[MangaFormComponent.LAST_READ_PARAM],
      );
    }
  }

  public save(): void {
    if (!this.manga) {
      return;
    }
    this.service.save(this.manga).then((manga) => {
      this.sync.sync(manga).then(() => window.close());
    });
  }

  public getColorClass() {
    return BoxComponent.getColorClass(this.color);
  }

}
