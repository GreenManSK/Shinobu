import { Component, NgZone, OnInit } from '@angular/core';
import { BoxColor } from '../box/box-color.enum';
import { BoxItem } from '../item-box/data/BoxItem';
import { BoxButton } from '../item-box/data/BoxButton';
import { AnimeService } from '../../services/anime.service';
import { ChromeMockStorageService } from '../../../../mocks/chrome-mock-storage.service';
import { Anime } from '../../types/anime';
import { Episode } from '../../types/episode';
import { BoxLink } from '../item-box/data/BoxLink';
import { MessageService } from '../../../../services/message.service';
import { PopUpService } from '../../../../services/pop-up.service';
import { KirinoFormComponent } from '../kirino-form/kirino-form.component';
import { AnimeFormComponent } from '../anime-form/anime-form.component';
import { AnidbParserService } from '../../../../services/parsers/anidb-parser.service';
import { NyaaSearchService } from '../../services/nyaa-search.service';
import { ErrorService } from '../../../../services/error.service';

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

  public items: BoxItem[] = [];

  private buttons: BoxButton[] = [
    new BoxButton('Mark as seen', 'eye', this.seenEpisode.bind(this)),
    new BoxButton('Edit', 'pencil', this.editAnime.bind(this)),
    new BoxButton('Delete', 'trash-o', this.deleteAnime.bind(this))
  ];

  public addButton = new BoxButton('Add', 'plus', this.addAnime.bind(this));

  constructor(
    public popUpService: PopUpService,
    private zone: NgZone,
    private nyaaSearch: NyaaSearchService,
    private service: AnimeService,
    messageService: MessageService,
    errorService: ErrorService
  ) {
    messageService.onMessage(this.syncKey, () => {
      this.zone.run(() => {
        this.reloadItems();
      });
    });
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

  public addAnime(): void {
    this.popUpService.openPopUp(
      KirinoFormComponent.getUrl(AnimeFormComponent.TYPE),
      'Add',
      AnimeFormComponent.WIDTH,
      AnimeFormComponent.HEIGHT
    );
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
      let nyaaSearch: BoxLink = null;
      if (anime.nyaaSearch) {
        const searchText = this.nyaaSearch.generateSearchText(anime, episode);
        nyaaSearch = new BoxLink(searchText, this.nyaaSearch.getSearchUrl(searchText));
      }
      episodes.push(new BoxItem(
        anime.title + ' [' + episode.episodeNumber + ']',
        null,
        new Date(episode.airdate),
        anime.id,
        {
          anime,
          episode
        },
        [new BoxLink('aniDB.net', AnidbParserService.getUrl(anime.id))],
        this.buttons,
        nyaaSearch
      ));
    }
    return episodes;
  }
}
