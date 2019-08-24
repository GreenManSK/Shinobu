import { Component, OnInit } from '@angular/core';
import { BoxColor } from '../box/box-color.enum';
import { BoxItem } from '../box/data/BoxItem';
import { BoxButton } from '../box/data/BoxButton';
import { ChromeMockStorageService } from '../../../mocks/chrome-mock-storage.service';
import { ShowService } from '../../services/show.service';
import { Anime } from '../../types/anime';
import { Episode } from '../../types/episode';
import { Show } from '../../types/show';
import { BoxLink } from "../box/data/BoxLink";

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
    new BoxButton('Mark as seen', 'eye', this.seenShow),
    new BoxButton('Edit', 'pencil', this.editShow),
    new BoxButton('Delete', 'trash-o', this.deleteShow)
  ];

  constructor(
    chromeStorage: ChromeMockStorageService
  ) {
    this.service = new ShowService(chromeStorage);
  }

  ngOnInit() {
    this.reloadItems();
  }

  public synchronizeShow( item: BoxItem ): void {
    // TODO
  }

  public seenShow( item: BoxItem ): void {
    // TODO
    console.log('seen');
  }

  public editShow( item: BoxItem ): void {
    // TODO
    console.log('edit');
  }

  public deleteShow( item: BoxItem ): void {
    // TODO
    console.log('delete');
  }

  private reloadItems(): void {
    this.service.getAll().then(( shows: Show[] ) => {
      shows = [
        new Show('Dumbbell Nan Kilo Moteru?', 555, 'searh me', [
          new Episode('12', 1566642691787),
          new Episode('13', 1566742691787),
          new Episode('14', 1566842691787),
          new Episode('15', 1566942691787),
        ])
      ];
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
