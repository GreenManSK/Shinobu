import { Component, NgZone, OnInit } from '@angular/core';
import { BoxColor } from '../box/box-color.enum';
import { BoxItem } from '../item-box/data/BoxItem';
import { BoxButton } from '../item-box/data/BoxButton';
import { PopUpService } from '../../../../services/pop-up.service';
import { NyaaSearchService } from '../../services/nyaa-search.service';
import { MessageService } from '../../../../services/message.service';
import { ErrorService } from '../../../../services/error.service';
import { MangaService } from '../../services/manga.service';
import { Episode } from '../../types/episode';
import { Manga } from '../../types/manga';
import { KirinoFormComponent } from '../kirino-form/kirino-form.component';
import { AnimeFormComponent } from '../anime-form/anime-form.component';
import { MangaFormComponent } from '../manga-form/manga-form.component';
import { MangaParserService } from '../../../../services/parsers/manga-parser.service';
import { BoxLink } from '../item-box/data/BoxLink';

type DataBag = {
  manga: Manga,
  episode: Episode
};

@Component({
  selector: 'manga-box',
  templateUrl: './manga-box.component.html',
  styleUrls: ['./manga-box.component.scss']
})
export class MangaBoxComponent implements OnInit {

  public static readonly SYNC_KEY = 'MangaBox';

  public readonly color = BoxColor.Orange;
  public readonly syncKey = MangaBoxComponent.SYNC_KEY;

  public items: BoxItem[] = [];

  private buttons: BoxButton[] = [
    new BoxButton('Mark as read', 'eye', this.seenEpisode.bind(this)),
    new BoxButton('Edit', 'pencil', this.editManga.bind(this)),
    new BoxButton('Delete', 'trash-o', this.deleteManga.bind(this))
  ];

  public addButton = new BoxButton('Add', 'plus', this.addManga.bind(this));

  constructor(
    public popUpService: PopUpService,
    private zone: NgZone,
    private nyaaSearch: NyaaSearchService,
    private service: MangaService,
    // private sync: AnimeSyncService,
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

  public synchronizeManga( item: BoxItem ): void {
    // TODO
  }

  public seenEpisode( item: DataBag ): void {
    const index = item.manga.episodes.indexOf(item.episode);
    if (index < 0) {
      return;
    }
    item.manga.episodes.splice(index, 1);
    this.service.save(item.manga).then(() => {
      this.reloadItems();
    });
  }

  public addManga(): void {
    this.popUpService.openPopUp(
      KirinoFormComponent.getUrl(MangaFormComponent.TYPE),
      'Add',
      MangaFormComponent.WIDTH,
      MangaFormComponent.HEIGHT
    );
  }

  public editManga( item: DataBag ): void {
    this.popUpService.openPopUp(
      KirinoFormComponent.getUrl(MangaFormComponent.TYPE, item.manga.id),
      'Edit',
      MangaFormComponent.WIDTH,
      MangaFormComponent.HEIGHT
    );
  }

  public deleteManga( item: DataBag ): void {
    this.service.delete(item.manga).then(() => {
      this.reloadItems();
    });
  }

  private reloadItems(): void {
    this.service.getAll().then(( mangas: Manga[] ) => {
      const items = [];
      mangas.forEach(manga => items.push(...this.toEpisodeItems(manga)));
      this.items = items;
    });
  }

  private toEpisodeItems( manga: Manga ): BoxItem[] {
    const episodes = [];
    for (const episode of manga.episodes) {
      episodes.push(new BoxItem(
        manga.title + ' [' + episode.episodeNumber + ']',
        null,
        null,
        manga.id,
        {
          manga,
          episode
        },
        [new BoxLink('Amazon', MangaParserService.getUrl(manga.amazonId))],
        this.buttons
      ));
    }
    if (episodes.length <= 0) {
      episodes.push(new BoxItem(
        manga.title,
        null,
        null,
        manga.id,
        {
          manga
        },
        [new BoxLink('Amazon', MangaParserService.getUrl(manga.amazonId))],
        this.buttons.slice(1, 3)
      ));
    }
    return episodes;
  }
}
