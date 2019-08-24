import { Component, OnInit } from '@angular/core';
import { BoxColor } from '../box/box-color.enum';
import { BoxItem } from '../box/data/BoxItem';
import { ChromeMockStorageService } from '../../../mocks/chrome-mock-storage.service';
import { OvaService } from '../../services/ova.service';
import { Ova } from '../../types/ova';
import { BoxLink } from "../box/data/BoxLink";
import { BoxButton } from "../box/data/BoxButton";

@Component({
  selector: 'ova-box',
  templateUrl: './ova-box.component.html',
  styleUrls: ['./ova-box.component.scss']
})
export class OvaBoxComponent implements OnInit {

  private readonly color = BoxColor.Pink;
  private readonly syncKey = 'OvaBox';

  private service: OvaService;
  private items: BoxItem[] = [];

  private buttons: BoxButton[] = [
    new BoxButton('Edit', 'pencil', this.editOva),
    new BoxButton('Delete', 'trash-o', this.deleteOva)
  ];

  constructor(
    chromeStorage: ChromeMockStorageService
  ) {
    this.service = new OvaService(chromeStorage);
  }

  ngOnInit() {
    this.reloadItems();
  }

  public synchronizeOva( item: BoxItem ): void {
    // TODO
  }

  public editOva( id: number ): void {
    // TODO
    console.log('edit');
  }

  public deleteOva( id: number ): void {
    // TODO
    console.log('delete');
  }

  private reloadItems(): void {
    this.service.getAll().then(( ovas: Ova[] ) => {
      ovas = [
        new Ova('Code Geass: Boukoku no Akito - 5 - To the Beloved', 12345, 1866642691787),
        new Ova('Code Geass: Boukoku no Akito - 5 - To the Beloved', 12345, 1566642691787),
        new Ova('Code Geass: Boukoku no Akito - 5 - To the Beloved', 12345, 1766642691787)
      ];
      const items = [];
      ovas.forEach(ova => items.push(this.toBoxItem(ova)));
      this.items = items;
    });
  }

  private toBoxItem( ova: Ova ): BoxItem {
    return new BoxItem(
      ova.title,
      ova.title,
      new Date(ova.airdate),
      null,
      ova.id,
      [new BoxLink('aniDB.net', '#url')], // TODO: Add real url
      this.buttons
    );
  }
}
