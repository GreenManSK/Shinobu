import { Component, NgZone, OnInit } from '@angular/core';
import { BoxColor } from '../box/box-color.enum';
import { BoxItem } from '../item-box/data/BoxItem';
import { ChromeMockStorageService } from '../../../../mocks/chrome-mock-storage.service';
import { OvaService } from '../../services/ova.service';
import { Ova } from '../../types/ova';
import { BoxLink } from '../item-box/data/BoxLink';
import { BoxButton } from '../item-box/data/BoxButton';
import { MessageService } from '../../../../services/message.service';
import { KirinoFormComponent } from '../kirino-form/kirino-form.component';
import { PopUpService } from '../../../../services/pop-up.service';
import { OvaFormComponent } from '../ova-form/ova-form.component';
import { AnidbEpisodeParserService } from '../../../../services/parsers/anidb-episode-parser.service';
import { ErrorService } from '../../../../services/error.service';
import { OvaSyncService } from '../../../background/service/sync/ova-sync.service';

@Component({
  selector: 'ova-box',
  templateUrl: './ova-box.component.html',
  styleUrls: ['./ova-box.component.scss']
})
export class OvaBoxComponent implements OnInit {

  public static readonly SYNC_KEY = 'OvaBox';

  public readonly color = BoxColor.Pink;
  public readonly syncKey = OvaBoxComponent.SYNC_KEY;

  public items: BoxItem[] = [];

  private buttons: BoxButton[] = [
    new BoxButton('Edit', 'pencil', this.editOva.bind(this)),
    new BoxButton('Delete', 'trash-o', this.deleteOva.bind(this))
  ];

  public addButton = new BoxButton('Add', 'plus', this.addOva.bind(this));

  constructor(
    public popUpService: PopUpService,
    private zone: NgZone,
    private service: OvaService,
    private sync: OvaSyncService,
    messageService: MessageService,
  ) {
    messageService.onMessage(this.syncKey, () => {
      this.zone.run(() => {
        this.reloadItems();
      });
    });
  }

  ngOnInit() {
    this.reloadItems();
  }

  public synchronizeOva( item: BoxItem ): void {
    const id = (item.data as Ova).id;
    this.sync.sync(id).then(() => this.reloadItems());
  }

  public addOva(): void {
    this.popUpService.openPopUp(
      KirinoFormComponent.getUrl(OvaFormComponent.TYPE),
      'Add',
      OvaFormComponent.WIDTH,
      OvaFormComponent.HEIGHT
    );
  }

  public editOva( ova: Ova ): void {
    this.popUpService.openPopUp(
      KirinoFormComponent.getUrl(OvaFormComponent.TYPE, ova.id),
      'Edit',
      OvaFormComponent.WIDTH,
      OvaFormComponent.HEIGHT
    );
  }

  public deleteOva( ova: Ova ): void {
    this.service.delete(ova).then(() => {
      this.reloadItems();
    });
  }

  private reloadItems(): void {
    this.service.getAll().then(( ovas: Ova[] ) => {
      const items = [];
      ovas.forEach(ova => items.push(this.toBoxItem(ova)));
      this.items = items;
    });
  }

  private toBoxItem( ova: Ova ): BoxItem {
    return new BoxItem(
      ova.title,
      null,
      ova.airdate ? new Date(ova.airdate) : null,
      null,
      ova,
      ova.anidbId ? [new BoxLink('aniDB.net', AnidbEpisodeParserService.getUrl(ova.anidbId))] : [],
      this.buttons
    );
  }
}
