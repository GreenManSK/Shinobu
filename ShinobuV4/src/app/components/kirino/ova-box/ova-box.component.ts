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

@Component({
  selector: 'ova-box',
  templateUrl: './ova-box.component.html',
  styleUrls: ['./ova-box.component.scss']
})
export class OvaBoxComponent implements OnInit, OnDestroy {

  public readonly color = Color.Pink;

  public items: BoxItem[] = [];
  public addButton = new BoxButton('Add', 'ri-add-box-line', () => this.addOva());

  private buttons: BoxButton[] = [
    new BoxButton('Edit', 'ri-edit-2-line', ( ova: Ova ) => this.editOva(ova)),
    new BoxButton('Delete', 'ri-delete-bin-6-line', ( ova: Ova ) => this.deleteOva(ova))
  ];
  private dataSubscription?: Subscription;

  constructor(
    private service: OvaService,
    private popUpService: PopUpService,
  ) {
  }

  ngOnInit(): void {
    this.service.onReady().then(() => {
      this.dataSubscription = this.service.getAll().subscribe(ovas => {
        this.items = ovas.map(ova => this.toBoxItem(ova));
      });
    });
  }

  ngOnDestroy() {
    this.dataSubscription?.unsubscribe();
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
}
