import { Component, OnInit } from '@angular/core';
import { BoxColor } from '../box/box-color.enum';
import { BoxItem } from '../box/data/BoxItem';
import { BoxButton } from '../box/data/BoxButton';
import { ChromeMockStorageService } from '../../../mocks/chrome-mock-storage.service';
import { ShowService } from '../../services/show.service';
import { Episode } from '../../types/episode';
import { Show } from '../../types/show';
import { BoxLink } from '../box/data/BoxLink';
import { MessageService } from "../../../services/message.service";

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


  private readonly color = BoxColor.Green;
  private readonly syncKey = 'ShowBox';

  private service: ShowService;
  private items: BoxItem[] = [];

  private buttons: BoxButton[] = [
    new BoxButton('Mark as seen', 'eye', this.seenShow.bind(this)),
    new BoxButton('Edit', 'pencil', this.editShow.bind(this)),
    new BoxButton('Delete', 'trash-o', this.deleteShow.bind(this))
  ];

  constructor(
    chromeStorage: ChromeMockStorageService,
    messageService: MessageService
  ) {
    this.service = new ShowService(chromeStorage);
    messageService.onMessage(this.syncKey, () => {
      this.reloadItems();
    });

    // TODO: Remove mocks
    const shows = [
      new Show('Dumbbell Nan Kilo Moteru?', 555, 'searh me', [
        new Episode('12', 1566642691787),
        new Episode('13', 1566742691787),
        new Episode('14', 1566842691787),
        new Episode('15', 1566942691787),
      ])
    ];
    for (const show of shows) {
      this.service.save(show);
    }
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

  public editShow( item: DataBag ): void {
    // TODO
    console.log('edit');
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
        [new BoxLink('TheTVDB.com', '#url')], // TODO: Add real url
        this.buttons,
        show.url ? new BoxLink(show.url, show.url) : null
      ));
    }
    return episodes;
  }
}
