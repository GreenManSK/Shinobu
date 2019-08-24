import { Component, NgZone, OnInit } from '@angular/core';
import { BoxColor } from '../box/box-color.enum';
import { BoxItem } from '../item-box/data/BoxItem';
import { ChromeMockStorageService } from '../../../mocks/chrome-mock-storage.service';
import { OvaService } from '../../services/ova.service';
import { Ova } from '../../types/ova';
import { BoxLink } from '../item-box/data/BoxLink';
import { BoxButton } from '../item-box/data/BoxButton';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'ova-box',
  templateUrl: './ova-box.component.html',
  styleUrls: ['./ova-box.component.scss']
})
export class OvaBoxComponent implements OnInit {

  public readonly color = BoxColor.Pink;
  public readonly syncKey = 'OvaBox';

  private service: OvaService;
  public items: BoxItem[] = [];

  private buttons: BoxButton[] = [
    new BoxButton('Edit', 'pencil', this.editOva.bind(this)),
    new BoxButton('Delete', 'trash-o', this.deleteOva.bind(this))
  ];

  constructor(
    private zone: NgZone,
    chromeStorage: ChromeMockStorageService,
    messageService: MessageService
  ) {
    this.service = new OvaService(chromeStorage);
    messageService.onMessage(this.syncKey, () => {
      this.zone.run(() => {
        this.reloadItems();
      });
    });

    // TODO: Remove mocks
    const ovas = [
      new Ova('Code Geass: Boukoku no Akito - 5 - To the Beloved', 12345, 1866642691787),
      new Ova('Code Geass: Boukoku no Akito - 5 - To the Beloved', 12345, 1566642691787),
      new Ova('Code Geass: Boukoku no Akito - 5 - To the Beloved', 12345, 1766642691787)
    ];
    for (const show of ovas) {
      this.service.save(show);
    }
  }

  ngOnInit() {
    this.reloadItems();
  }

  public synchronizeOva( item: BoxItem ): void {
    // TODO
  }

  public editOva( ova: Ova ): void {
    // TODO
    console.log('edit');
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
      new Date(ova.airdate),
      null,
      ova,
      [new BoxLink('aniDB.net', '#url')], // TODO: Add real url
      this.buttons
    );
  }
}
