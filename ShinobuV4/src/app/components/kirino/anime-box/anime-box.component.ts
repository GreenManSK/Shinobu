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
  public addButton = new BoxButton('Add', 'ri-add-box-line', () => this.addAnime());

  private buttons: BoxButton[] = [
    new BoxButton('Mark as seen', 'ri-eye-line'),
    new BoxButton('Edit', 'ri-edit-2-line', ( bag: DataBag ) => this.editAnime(bag)),
    new BoxButton('Delete', 'ri-delete-bin-6-line')
  ];
  private dataSubscription?: Subscription;

  constructor(
    private service: AnimeService,
    private popUpService: PopUpService
  ) {
    console.log(AnidbParserService.getApiUrl(17089));
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
        nyaaSearch = new BoxLink(anime.nyaaSearch); // TODO: Use nyaa serach service for link
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
        [new BoxLink('aniDB.net', AnidbParserService.getUrl(anime.id ? +anime.id : 0))],
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
        [new BoxLink('aniDB.net', AnidbParserService.getUrl(anime.id ? +anime.id : 0))],
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

  private editAnime( bag: DataBag ) {
    this.popUpService.openPopUp(
      KirinoFormComponent.getUrl(AnimeFormComponent.TYPE, bag.anime.id),
      'Edit',
      AnimeFormComponent.WIDTH,
      AnimeFormComponent.HEIGHT
    );
  }
}
