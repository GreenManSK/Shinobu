import { Component, Input, OnInit } from '@angular/core';
import { BoxColor } from '../box/box-color.enum';
import { OvaService } from '../../services/ova.service';
import { Ova } from '../../types/ova';
import { BoxComponent } from '../box/box.component';
import { ChromeMockStorageService } from '../../../mocks/chrome-mock-storage.service';
import { MessageService } from '../../../services/message.service';
import { OvaBoxComponent } from '../ova-box/ova-box.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ova-form',
  templateUrl: './ova-form.component.html',
  styleUrls: ['./ova-form.component.scss']
})
export class OvaFormComponent implements OnInit {

  public static readonly TYPE = 'ova';
  public static readonly WIDTH = 600;
  public static readonly HEIGHT = 500;

  public static readonly TITLE_PARAM = 'title';
  public static readonly ANIDB_ID_PARAM = 'anidbId';
  public static readonly DATE_PARAM = 'date';

  public readonly color = BoxColor.Pink;
  private service: OvaService;

  public _id: number;
  public ova: Ova;

  constructor(
    chromeStorage: ChromeMockStorageService,
    public messageService: MessageService,
    private route: ActivatedRoute,
  ) {
    this.service = new OvaService(chromeStorage);
  }

  ngOnInit() {
  }

  @Input('id')
  public set id( id: number ) {
    this._id = id;
    if (id) {
      this.service.get(id).then(( ova: Ova ) => this.ova = ova);
    } else {
      this.ova = new Ova(
        this.route.snapshot.queryParams[OvaFormComponent.TITLE_PARAM],
        +this.route.snapshot.queryParams[OvaFormComponent.ANIDB_ID_PARAM],
        +this.route.snapshot.queryParams[OvaFormComponent.DATE_PARAM]
      );
    }
  }

  public save(): void {
    this.service.save(this.ova).then(() => {
      this.messageService.sendMessage(OvaBoxComponent.SYNC_KEY, 'reload');
      window.close();
    });
  }


  public get colorClass() {
    return BoxComponent.getColorClass(this.color);
  }

  public updateAirdate( date: string ): void {
    this.ova.airdate = new Date(date).getTime();
  }
}
