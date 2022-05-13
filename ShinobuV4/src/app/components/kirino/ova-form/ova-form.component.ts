import { Component, Input, OnInit } from '@angular/core';
import { Color } from '../../../types/Color';
import { Ova } from '../../../data/kirino/Ova';
import { ActivatedRoute } from '@angular/router';
import { OvaService } from '../../../services/data/kirino/ova.service';
import { BoxComponent } from '../../box/box.component';
import { Subscription } from 'rxjs';

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

  public readonly color = Color.Pink;

  private _id: string = '';
  public ova?: Ova;

  constructor(
    private route: ActivatedRoute,
    private service: OvaService
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
        subscription = this.service.getById(id).subscribe(ova => {
          this.ova = ova;
          subscription.unsubscribe();
        });
      });
    } else {
      this.ova = new Ova(
        this.route.snapshot.queryParams[OvaFormComponent.TITLE_PARAM],
        +this.route.snapshot.queryParams[OvaFormComponent.ANIDB_ID_PARAM],
        +this.route.snapshot.queryParams[OvaFormComponent.DATE_PARAM]
      );
    }
  }

  public save(): void {
    if (!this.ova) {
      return;
    }
    this.service.save(this.ova).then(() => {
      // TODO: Sync data
      window.close();
    });
  }

  public getColorClass() {
    return BoxComponent.getColorClass(this.color);
  }

  public updateAirdate( date: string ): void {
    if (!this.ova) {
      return;
    }
    this.ova.airdate = new Date(date).getTime();
  }

}
