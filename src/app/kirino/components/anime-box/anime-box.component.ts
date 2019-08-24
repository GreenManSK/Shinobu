import { Component, OnInit } from '@angular/core';
import { BoxColor } from '../box/box-color.enum';
import { BoxItem } from '../box/data/BoxItem';
import { BoxButton } from '../box/data/BoxButton';
import { AnimeService } from '../../services/anime.service';
import { ChromeMockStorageService } from '../../../mocks/chrome-mock-storage.service';
import { Ova } from '../../types/ova';
import { Anime } from '../../types/anime';
import { Episode } from "../../types/episode";
import { BoxLink } from "../box/data/BoxLink";

@Component({
  selector: 'anime-box',
  templateUrl: './anime-box.component.html',
  styleUrls: ['./anime-box.component.scss']
})
export class AnimeBoxComponent implements OnInit {

  private readonly color = BoxColor.Red;
  private readonly syncKey = 'AnimeBox';

  private service: AnimeService;
  private items: BoxItem[] = [];

  private buttons: BoxButton[] = [
    new BoxButton('Mark as seen', 'eye', this.seenEpisode),
    new BoxButton('Edit', 'pencil', this.editAnime),
    new BoxButton('Delete', 'trash-o', this.deleteAnime)
  ];

  constructor(
    chromeStorage: ChromeMockStorageService
  ) {
    this.service = new AnimeService(chromeStorage);
  }

  ngOnInit() {
    this.reloadItems();
  }

  public synchronizeAnime( item: BoxItem ): void {
    // TODO
  }

  public seenEpisode( item: BoxItem ): void {
    // TODO
    console.log('seen');
  }

  public editAnime( item: BoxItem ): void {
    // TODO
    console.log('edit');
  }

  public deleteAnime( item: BoxItem ): void {
    // TODO
    console.log('delete');
  }

  private reloadItems(): void {
    this.service.getAll().then(( animes: Anime[] ) => {
      animes = [
        new Anime('Dumbbell Nan Kilo Moteru?', 555, 'searh me', [
          new Episode('12', 1566642691787),
          new Episode('13', 1566742691787),
          new Episode('14', 1566842691787),
          new Episode('15', 1566942691787),
        ])
      ];
      const items = [];
      animes.forEach(anime => items.push(...this.toEpisodeItems(anime)));
      this.items = items;
    });
  }

  private toEpisodeItems( anime: Anime ): BoxItem[] {
    const episodes = [];
    for (const episode of anime.episodes) {
      episodes.push(new BoxItem(
        anime.title + ' [' + episode.episodeNumber + ']',
        null,
        new Date(episode.airdate),
        anime.id,
        {
          anime,
          episode
        },
        [new BoxLink('aniDB.net', '#url')], // TODO: Add real url
        this.buttons,
        anime.nyaaSearch ? new BoxLink(anime.nyaaSearch, anime.nyaaSearch) : null // TODO: Make real
      ));
    }
    return episodes;
  }
}
