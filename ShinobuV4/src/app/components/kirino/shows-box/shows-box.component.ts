import { Component, OnDestroy, OnInit } from '@angular/core';
import { Color } from '../../../types/Color';
import { BoxItem } from '../../../types/kirino/BoxItem';
import { BoxButton } from '../../../types/kirino/BoxButton';
import { Subscription } from 'rxjs';
import { Show } from '../../../data/kirino/Show';
import { ShowService } from '../../../services/data/kirino/show.service';
import { PopUpService } from '../../../services/pop-up.service';
import { Episode } from '../../../data/kirino/Episode';
import { BoxLink } from '../../../types/kirino/BoxLink';
import { TheTVDBParserService } from '../../../services/parsers/kirino/the-tvdbparser.service';
import { KirinoFormComponent } from '../kirino-form/kirino-form.component';
import { ShowFormComponent } from '../show-form/show-form.component';
import { ShowSyncService } from '../../../services/sync/kirino/show-sync.service';
import { InternetConnectionService } from '../../../services/internet-connection.service';

type DataBag = {
  show: Show,
  episode: Episode
};

@Component({
  selector: 'shows-box',
  templateUrl: './shows-box.component.html',
  styleUrls: ['./shows-box.component.scss']
})
export class ShowsBoxComponent implements OnInit, OnDestroy {

  public readonly color = Color.Green;

  public items: BoxItem[] = [];
  public headerButtons = [
    new BoxButton('Add', 'ri-add-box-line', () => this.addShow()),
    new BoxButton('Sync all', 'ri-refresh-line', () => this.syncAll()),
  ];

  private buttons: BoxButton[] = [
    new BoxButton('Mark as seen', 'ri-eye-line', ( bag: DataBag ) => this.markAsShow(bag)),
    new BoxButton('Edit', 'ri-edit-2-line', ( bag: DataBag ) => this.editShow(bag)),
    new BoxButton('Delete', 'ri-delete-bin-6-line', ( bag: DataBag ) => this.deleteShow(bag))
  ];
  private dataSubscription?: Subscription;
  private internetSubscription?: Subscription;

  constructor(
    private service: ShowService,
    private popUpService: PopUpService,
    private syncService: ShowSyncService,
    private internetConnectionService: InternetConnectionService
  ) {
  }

  ngOnInit(): void {
    this.internetSubscription = this.internetConnectionService.asObservable().subscribe(connected => {
      this.headerButtons[1].disabled = !connected;
    });
    this.service.onReady().then(() => {
      this.dataSubscription = this.service.getAll().subscribe(show => {
        const items = [] as BoxItem[];
        show.forEach(s => items.push(...this.toEpisodeItems(s)));
        this.items = items;
      });
    });
  }

  ngOnDestroy() {
    this.dataSubscription?.unsubscribe();
    this.internetSubscription?.unsubscribe();
  }

  private toEpisodeItems( show: Show ): BoxItem[] {
    const episodes = [] as BoxItem[];
    for (const episode of show.episodes) {
      episodes.push(new BoxItem(
        `${show.title} [${episode.number}]`,
        '',
        episode.airdate ? new Date(episode.airdate) : undefined,
        show.id,
        {
          show,
          episode
        },
        [new BoxLink('TheTVDB.com', TheTVDBParserService.getUrl(show.tvdbId))],
        this.buttons,
        show.url ? new BoxLink(show.url, show.url) : undefined
      ));
    }
    if (episodes.length <= 0) {
      episodes.push(new BoxItem(
        show.title,
        '',
        undefined,
        show.id,
        {
          show
        },
        [new BoxLink('TheTVDB.com', TheTVDBParserService.getUrl(show.tvdbId))],
        this.buttons.slice(1, 3),
      ));
    }
    return episodes;
  }

  private addShow() {
    this.popUpService.openPopUp(
      KirinoFormComponent.getUrl(ShowFormComponent.TYPE),
      'Add',
      ShowFormComponent.WIDTH,
      ShowFormComponent.HEIGHT
    );
  }

  private editShow( {show}: DataBag ) {
    this.popUpService.openPopUp(
      KirinoFormComponent.getUrl(ShowFormComponent.TYPE, show.id),
      'Edit',
      ShowFormComponent.WIDTH,
      ShowFormComponent.HEIGHT
    );
  }

  private deleteShow( {show}: DataBag ) {
    this.service.delete(show);
  }

  private markAsShow( bag: DataBag ) {
    const index = bag.show.episodes.indexOf(bag.episode);
    if (index < 0) {
      return;
    }
    bag.show.episodes.splice(index, 1);
    bag.show.lastSeen = Math.max(bag.show.parseEpisodeNumber(bag.episode.number), bag.show.lastSeen);
    this.service.save(bag.show);
  }

  public syncItem(item: BoxItem) {
    const show = item.data.show as Show;
    this.syncService.sync(show, true, true);
  }

  private syncAll() {
    this.syncService.syncAll(false, true);
  }
}
