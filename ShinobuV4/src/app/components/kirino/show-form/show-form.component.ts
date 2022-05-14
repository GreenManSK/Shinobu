import { Component, Input, OnInit } from '@angular/core';
import { Color } from '../../../types/Color';
import { Show } from '../../../data/kirino/Show';
import { ActivatedRoute } from '@angular/router';
import { ShowService } from '../../../services/data/kirino/show.service';
import { Subscription } from 'rxjs';
import { BoxComponent } from '../../box/box.component';
import { ShowSyncService } from '../../../services/sync/kirino/show-sync.service';

@Component({
  selector: 'show-form',
  templateUrl: './show-form.component.html',
  styleUrls: ['./show-form.component.scss']
})
export class ShowFormComponent implements OnInit {

  public static readonly TYPE = 'show';
  public static readonly WIDTH = 600;
  public static readonly HEIGHT = 500;

  public static readonly TITLE_PARAM = 'title';
  public static readonly TVDB_ID_PARAM = 'tvdbId';

  public readonly color = Color.Green;

  private _id: string = '';
  public show?: Show;

  constructor(
    private route: ActivatedRoute,
    private service: ShowService,
    private sync: ShowSyncService
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
        subscription = this.service.getById(id).subscribe(show => {
          this.show = show;
          subscription.unsubscribe();
        });
      });
    } else {
      this.show = new Show(
        this.route.snapshot.queryParams[ShowFormComponent.TITLE_PARAM],
        this.route.snapshot.queryParams[ShowFormComponent.TVDB_ID_PARAM]
      );
    }
  }

  public save(): void {
    if (!this.show) {
      return;
    }
    this.service.save(this.show).then(( show ) => {
      this.sync.sync(show).then(() => window.close());
    });
  }

  public getColorClass() {
    return BoxComponent.getColorClass(this.color);
  }

}
