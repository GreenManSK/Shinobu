import { Component, OnDestroy, OnInit } from '@angular/core';
import { Color } from '../../../types/Color';
import { BoxItem } from '../../../types/kirino/BoxItem';
import { BoxButton } from '../../../types/kirino/BoxButton';
import { AnimeService } from '../../../services/data/kirino/anime.service';
import { Subscription } from 'rxjs';
import { Anime } from '../../../data/kirino/Anime';
import { BoxLink } from '../../../types/kirino/BoxLink';
import { AnidbParserService } from '../../../services/parsers/kirino/anidb-parser.service';
import { PopUpService } from '../../../services/pop-up.service';
import { KirinoFormComponent } from '../kirino-form/kirino-form.component';
import { AnimeFormComponent } from '../anime-form/anime-form.component';
import { Episode } from '../../../data/kirino/Episode';
import { NyaaSearchService } from '../../../services/nyaa-search.service';
import { AnimeSyncService } from '../../../services/sync/kirino/anime-sync.service';

type DataBag = {
  anime: Anime,
  episode: Episode
};

@Component({
  selector: 'anime-box',
  templateUrl: './anime-box.component.html',
  styleUrls: ['./anime-box.component.scss']
})
export class AnimeBoxComponent implements OnInit, OnDestroy {

  public readonly color = Color.Red;

  public items: BoxItem[] = [];

  public headerButtons = [
    new BoxButton('Add', 'ri-add-box-line', () => this.addAnime()),
    new BoxButton('Sync all', 'ri-refresh-line', () => this.syncAll()),
  ];
  private buttons: BoxButton[] = [
    new BoxButton('Mark as seen', 'ri-eye-line', ( bag: DataBag ) => this.markAsSeen(bag)),
    new BoxButton('Edit', 'ri-edit-2-line', ( bag: DataBag ) => this.editAnime(bag)),
    new BoxButton('Delete', 'ri-delete-bin-6-line', ( bag: DataBag ) => this.deleteAnime(bag))
  ];
  private dataSubscription?: Subscription;

  constructor(
    private service: AnimeService,
    private popUpService: PopUpService,
    private nyaaSearch: NyaaSearchService,
    private syncService: AnimeSyncService
  ) {
  }

  ngOnInit(): void {
    this.service.onReady().then(() => {
      this.dataSubscription = this.service.getAll().subscribe(anime => {
        const items = [] as BoxItem[];
        anime.forEach(a => items.push(...this.toEpisodeItems(a)));
        this.items = items;
      });
    });
  }

  ngOnDestroy() {
    this.dataSubscription?.unsubscribe();
  }

  private toEpisodeItems( anime: Anime ): BoxItem[] {
    const episodes = [] as BoxItem[];
    for (const episode of anime.episodes) {
      let nyaaSearch: BoxLink | undefined = undefined;
      if (anime.nyaaSearch) {
        const searchText = this.nyaaSearch.generateSearchText(anime, episode);
        nyaaSearch = new BoxLink(searchText, this.nyaaSearch.getSearchUrl(searchText));
      }
      episodes.push(new BoxItem(
        anime.title + ' [' + episode.number + ']',
        '',
        episode.airdate ? new Date(episode.airdate) : undefined,
        anime.id,
        {
          anime,
          episode
        },
        [new BoxLink('aniDB.net', AnidbParserService.getUrl(anime.anidbId ? +anime.anidbId : 0))],
        this.buttons,
        nyaaSearch
      ));
    }
    if (episodes.length <= 0) {
      episodes.push(new BoxItem(
        anime.title,
        '',
        undefined,
        anime.id,
        {anime},
        [new BoxLink('aniDB.net', AnidbParserService.getUrl(anime.anidbId ? +anime.anidbId : 0))],
        this.buttons.slice(1, 3)
      ));
    }
    return episodes;
  }

  private addAnime() {
    this.popUpService.openPopUp(
      KirinoFormComponent.getUrl(AnimeFormComponent.TYPE),
      'Add',
      AnimeFormComponent.WIDTH,
      AnimeFormComponent.HEIGHT
    );
  }

  private editAnime( {anime}: DataBag ) {
    this.popUpService.openPopUp(
      KirinoFormComponent.getUrl(AnimeFormComponent.TYPE, anime.id),
      'Edit',
      AnimeFormComponent.WIDTH,
      AnimeFormComponent.HEIGHT
    );
  }

  private markAsSeen( {anime, episode}: DataBag ) {
    const index = anime.episodes.indexOf(episode);
    if (index < 0) {
      return;
    }
    anime.episodes.splice(index, 1);
    this.service.save(anime);
  }

  public deleteAnime( {anime}: DataBag ): void {
    this.service.delete(anime);
  }

  public syncItem( item: BoxItem ) {
    const anime = item.data.anime as Anime;
    this.syncService.sync(anime, true, true);
  }

  private syncAll() {
    this.syncService.syncAll(false, true);
  }
}
