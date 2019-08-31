import { Component, Input, OnInit } from '@angular/core';
import { BoxColor } from '../box/box-color.enum';
import { Show } from '../../types/show';
import { ShowService } from '../../services/show.service';
import { BoxComponent } from '../box/box.component';
import { ChromeMockStorageService } from '../../../../mocks/chrome-mock-storage.service';
import { MessageService } from '../../../../services/message.service';
import { ShowsBoxComponent } from '../shows-box/shows-box.component';
import { ActivatedRoute } from '@angular/router';
import { ErrorService } from '../../../../services/error.service';

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

  public readonly color = BoxColor.Green;
  private service: ShowService;

  public _id: number;
  public show: Show;

  constructor(
    chromeStorage: ChromeMockStorageService,
    public messageService: MessageService,
    private route: ActivatedRoute,
    errorService: ErrorService
  ) {
    this.service = new ShowService(chromeStorage, errorService);
  }

  ngOnInit() {
  }

  @Input('id')
  public set id( id: number ) {
    this._id = id;
    if (id) {
      this.service.get(id).then(( show: Show ) => this.show = show);
    } else {
      this.show = new Show(
        this.route.snapshot.queryParams[ShowFormComponent.TITLE_PARAM],
        this.route.snapshot.queryParams[ShowFormComponent.TVDB_ID_PARAM]
      );
    }
  }

  public save(): void {
    this.service.save(this.show).then(() => {
      this.messageService.sendMessage(ShowsBoxComponent.SYNC_KEY, 'reload');
      window.close();
    });
  }

  public get colorClass() {
    return BoxComponent.getColorClass(this.color);
  }

}
