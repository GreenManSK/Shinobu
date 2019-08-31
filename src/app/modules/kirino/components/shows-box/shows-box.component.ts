import { Component, NgZone, OnInit } from '@angular/core';
import { BoxColor } from '../box/box-color.enum';
import { BoxItem } from '../item-box/data/BoxItem';
import { BoxButton } from '../item-box/data/BoxButton';
import { ChromeMockStorageService } from '../../../../mocks/chrome-mock-storage.service';
import { ShowService } from '../../services/show.service';
import { Episode } from '../../types/episode';
import { Show } from '../../types/show';
import { BoxLink } from '../item-box/data/BoxLink';
import { MessageService } from '../../../../services/message.service';
import { KirinoFormComponent } from '../kirino-form/kirino-form.component';
import { PopUpService } from '../../../../services/pop-up.service';
import { ShowFormComponent } from '../show-form/show-form.component';
import { TheTVDBParserService } from '../../../../services/parsers/the-tvdbparser.service';
import { ErrorService } from '../../../../services/error.service';

type DataBag = {
  show: Show,
  episode: Episode
};

@Component({
  selector: 'shows-box',
  templateUrl: './shows-box.component.html',
  styleUrls: ['./shows-box.component.scss']
})
export class ShowsBoxComponent implements OnInit {

  public static readonly SYNC_KEY = 'ShowBox';

  public readonly color = BoxColor.Green;
  public readonly syncKey = ShowsBoxComponent.SYNC_KEY;

  private service: ShowService;
  public items: BoxItem[] = [];

  private buttons: BoxButton[] = [
    new BoxButton('Mark as seen', 'eye', this.seenShow.bind(this)),
    new BoxButton('Edit', 'pencil', this.editShow.bind(this)),
    new BoxButton('Delete', 'trash-o', this.deleteShow.bind(this))
  ];

  public addButton = new BoxButton('Add', 'plus', this.addShow.bind(this));

  constructor(
    public popUpService: PopUpService,
    private zone: NgZone,
    chromeStorage: ChromeMockStorageService,
    messageService: MessageService,
    errorService: ErrorService
  ) {
    this.service = new ShowService(chromeStorage, errorService);
    messageService.onMessage(this.syncKey, () => {
      this.zone.run(() => {
        this.reloadItems();
      });
    });
  }

  ngOnInit() {
    this.reloadItems();
  }

  public synchronizeShow( item: BoxItem ): void {
    // TODO
  }

  public seenShow( item: DataBag ): void {
    const index = item.show.episodes.indexOf(item.episode);
    if (index < 0) {
      return;
    }
    item.show.episodes.splice(index, 1);
    this.service.save(item.show).then(() => {
      this.reloadItems();
    });
  }

  public addShow(): void {
    this.popUpService.openPopUp(
      KirinoFormComponent.getUrl(ShowFormComponent.TYPE),
      'Add',
      ShowFormComponent.WIDTH,
      ShowFormComponent.HEIGHT
    );
  }

  public editShow( item: DataBag ): void {
    this.popUpService.openPopUp(
      KirinoFormComponent.getUrl(ShowFormComponent.TYPE, item.show.id),
      'Edit',
      ShowFormComponent.WIDTH,
      ShowFormComponent.HEIGHT
    );
  }

  public deleteShow( item: DataBag ): void {
    this.service.delete(item.show).then(() => {
      this.reloadItems();
    });
  }

  private reloadItems(): void {
    this.service.getAll().then(( shows: Show[] ) => {
      const items = [];
      shows.forEach(show => items.push(...this.toEpisodeItems(show)));
      this.items = items;
    });
  }

  private toEpisodeItems( show: Show ): BoxItem[] {
    const episodes = [];
    for (const episode of show.episodes) {
      episodes.push(new BoxItem(
        show.title + ' [' + episode.episodeNumber + ']',
        null,
        new Date(episode.airdate),
        show.id,
        {
          show,
          episode
        },
        [new BoxLink('TheTVDB.com', TheTVDBParserService.getUrl(show.tvdbId))],
        this.buttons,
        show.url ? new BoxLink(show.url, show.url) : null
      ));
    }
    return episodes;
  }
}
