import { Component, OnDestroy, OnInit } from '@angular/core';
import { Color } from '../../../types/Color';
import { BoxItem } from '../../../types/kirino/BoxItem';
import { BoxButton } from '../../../types/kirino/BoxButton';
import { Subscription } from 'rxjs';
import { Ova } from '../../../data/kirino/Ova';
import { PopUpService } from '../../../services/pop-up.service';
import { OvaService } from '../../../services/data/kirino/ova.service';
import { BoxLink } from '../../../types/kirino/BoxLink';
import { AnidbEpisodeParserService } from '../../../services/parsers/kirino/anidb-episode-parser.service';
import { KirinoFormComponent } from '../kirino-form/kirino-form.component';
import { OvaFormComponent } from '../ova-form/ova-form.component';
import { OvaSyncService } from '../../../services/sync/kirino/ova-sync.service';
import { InternetConnectionService } from '../../../services/internet-connection.service';

@Component({
  selector: 'ova-box',
  templateUrl: './ova-box.component.html',
  styleUrls: ['./ova-box.component.scss']
})
export class OvaBoxComponent implements OnInit, OnDestroy {

  public readonly color = Color.Pink;

  public items: BoxItem[] = [];
  public headerButtons = [
    new BoxButton('Add', 'ri-add-box-line', () => this.addOva()),
    new BoxButton('Sync all', 'ri-refresh-line', () => this.syncAll()),
  ];

  private buttons: BoxButton[] = [
    new BoxButton('Edit', 'ri-edit-2-line', ( ova: Ova ) => this.editOva(ova)),
    new BoxButton('Delete', 'ri-delete-bin-6-line', ( ova: Ova ) => this.deleteOva(ova))
  ];
  private dataSubscription?: Subscription;
  private internetSubscription?: Subscription;

  constructor(
    private service: OvaService,
    private popUpService: PopUpService,
    private syncService: OvaSyncService,
    private internetConnectionService: InternetConnectionService
  ) {
  }

  ngOnInit(): void {
    this.internetSubscription = this.internetConnectionService.asObservable().subscribe(connected => {
      this.headerButtons[1].disabled = !connected;
    });
    this.service.onReady().then(() => {
      this.dataSubscription = this.service.getAll().subscribe(ovas => {
        this.items = ovas.map(ova => this.toBoxItem(ova));
      });
    });
  }

  ngOnDestroy() {
    this.dataSubscription?.unsubscribe();
    this.internetSubscription?.unsubscribe();
  }

  private toBoxItem( ova: Ova ) {
    return new BoxItem(
      ova.title,
      '',
      ova.airdate ? new Date(ova.airdate) : undefined,
      null,
      ova,
      ova.anidbId ? [new BoxLink('aniDB.net', AnidbEpisodeParserService.getUrl(ova.anidbId))] : [],
      this.buttons
    );
  }

  private addOva() {
    this.popUpService.openPopUp(
      KirinoFormComponent.getUrl(OvaFormComponent.TYPE),
      'Add',
      OvaFormComponent.WIDTH,
      OvaFormComponent.HEIGHT
    );
  }

  private editOva( ova: Ova ) {
    this.popUpService.openPopUp(
      KirinoFormComponent.getUrl(OvaFormComponent.TYPE, ova.id),
      'Edit',
      OvaFormComponent.WIDTH,
      OvaFormComponent.HEIGHT
    );
  }

  private deleteOva( ova: Ova ) {
    this.service.delete(ova);
  }

  public syncItem( item: BoxItem ) {
    const ova = item.data as Ova;
    this.syncService.sync(ova, true, true);
  }

  private syncAll() {
    this.syncService.syncAll(false, true);
  }
}
