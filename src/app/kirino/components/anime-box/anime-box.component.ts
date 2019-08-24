import { Component, NgZone, OnInit } from '@angular/core';
import { BoxColor } from '../box/box-color.enum';
import { BoxItem } from '../item-box/data/BoxItem';
import { BoxButton } from '../item-box/data/BoxButton';
import { AnimeService } from '../../services/anime.service';
import { ChromeMockStorageService } from '../../../mocks/chrome-mock-storage.service';
import { Anime } from '../../types/anime';
import { Episode } from '../../types/episode';
import { BoxLink } from '../item-box/data/BoxLink';
import { MessageService } from '../../../services/message.service';
import { PopUpService } from '../../../services/pop-up.service';
import { KirinoFormComponent } from '../kirino-form/kirino-form.component';
import { AnimeFormComponent } from '../anime-form/anime-form.component';

type DataBag = {
  anime: Anime,
  episode: Episode
};

@Component({
  selector: 'anime-box',
  templateUrl: './anime-box.component.html',
  styleUrls: ['./anime-box.component.scss']
})
export class AnimeBoxComponent implements OnInit {

  public static readonly SYNC_KEY = 'AnimeBox';

  public readonly color = BoxColor.Red;
  public readonly syncKey = AnimeBoxComponent.SYNC_KEY;

  private service: AnimeService;
  public items: BoxItem[] = [];

  private buttons: BoxButton[] = [
    new BoxButton('Mark as seen', 'eye', this.seenEpisode.bind(this)),
    new BoxButton('Edit', 'pencil', this.editAnime.bind(this)),
    new BoxButton('Delete', 'trash-o', this.deleteAnime.bind(this))
  ];

  constructor(
    public popUpService: PopUpService,
    private zone: NgZone,
    chromeStorage: ChromeMockStorageService,
    messageService: MessageService
  ) {
    this.service = new AnimeService(chromeStorage);
    messageService.onMessage(this.syncKey, () => {
      this.zone.run(() => {
        this.reloadItems();
      });
    });

    // TODO: Remove mocks
    const animes = [
      new Anime('Dumbbell Nan Kilo Moteru?', 555, 'searh me', [
        new Episode('12', 1566642691787),
        new Episode('13', 1566742691787),
        new Episode('14', 1566842691787),
        new Episode('15', 1566942691787),
      ])
    ];
    for (const show of animes) {
      this.service.save(show);
    }
  }

  ngOnInit() {
    this.reloadItems();
  }

  public synchronizeAnime( item: BoxItem ): void {
    // TODO
  }

  public seenEpisode( item: DataBag ): void {
    const index = item.anime.episodes.indexOf(item.episode);
    if (index < 0) {
      return;
    }
    item.anime.episodes.splice(index, 1);
    this.service.save(item.anime).then(() => {
      this.reloadItems();
    });
  }

  public editAnime( item: DataBag ): void {
    this.popUpService.openPopUp(
      KirinoFormComponent.getUrl(AnimeFormComponent.TYPE, item.anime.id),
      'Edit',
      AnimeFormComponent.WIDTH,
      AnimeFormComponent.HEIGHT
    );
  }

  public deleteAnime( item: DataBag ): void {
    this.service.delete(item.anime).then(() => {
      this.reloadItems();
    });
  }

  private reloadItems(): void {
    this.service.getAll().then(( animes: Anime[] ) => {
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
