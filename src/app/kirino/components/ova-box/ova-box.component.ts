import {Component, OnInit} from '@angular/core';
import {BoxColor} from '../box/box-color.enum';
import {BoxItem} from '../box/data/BoxItem';
import {ChromeMockStorageService} from '../../../mocks/chrome-mock-storage.service';
import {OvaService} from '../../services/ova.service';
import {Ova} from '../../types/ova';

@Component({
  selector: 'ova-box',
  templateUrl: './ova-box.component.html',
  styleUrls: ['./ova-box.component.scss']
})
export class OvaBoxComponent implements OnInit {

  private readonly color = BoxColor.Orange;
  private readonly syncKey = 'OvaBox';

  private service: OvaService;
  private items: BoxItem[] = [];

  constructor(
    chromeStorage: ChromeMockStorageService
  ) {
    this.service = new OvaService(chromeStorage);
  }

  ngOnInit() {
    this.reloadItems();
  }

  public synchronizeOva(item: BoxItem): void {

  }

  private reloadItems(): void {
    this.service.getAll().then((ovas: Ova[]) => {
      ovas.forEach(ova => this.items.push(this.toBoxItem(ova)));
    });
  }

  private toBoxItem(ova: Ova): BoxItem {
    return new BoxItem(
      ova.title,
      '',
      new Date(ova.airdate),
      null,
      ova.id,
      // TODO: icons, buttons, link
    );
  }
}
