import { Component, OnDestroy, OnInit } from '@angular/core';
import { Color } from '../../../types/Color';
import { Episode } from '../../../data/kirino/Episode';
import { Manga } from '../../../data/kirino/Manga';
import { BoxItem } from '../../../types/kirino/BoxItem';
import { BoxButton } from '../../../types/kirino/BoxButton';
import { Subscription } from 'rxjs';
import { PopUpService } from '../../../services/pop-up.service';
import { MangaService } from '../../../services/data/kirino/manga.service';
import { BoxLink } from '../../../types/kirino/BoxLink';
import { MangaParserService } from '../../../services/parsers/kirino/manga-parser.service';
import { KirinoFormComponent } from '../kirino-form/kirino-form.component';
import { MangaFormComponent } from '../manga-form/manga-form.component';

type DataBag = {
  manga: Manga,
  episode: Episode
};


@Component({
  selector: 'manga-box',
  templateUrl: './manga-box.component.html',
  styleUrls: ['./manga-box.component.scss']
})
export class MangaBoxComponent implements OnInit, OnDestroy {

  public readonly color = Color.Purple;

  public items: BoxItem[] = [];
  public addButton = new BoxButton('Add', 'ri-add-box-line', () => this.addManga());

  private buttons: BoxButton[] = [
    new BoxButton('Mark as seen', 'ri-eye-line', ( bag: DataBag ) => this.markAsSeen(bag)),
    new BoxButton('Edit', 'ri-edit-2-line', ( bag: DataBag ) => this.editManga(bag)),
    new BoxButton('Delete', 'ri-delete-bin-6-line', ( bag: DataBag ) => this.deleteManga(bag))
  ];
  private dataSubscription?: Subscription;

  constructor(
    private service: MangaService,
    private popUpService: PopUpService,
  ) {
  }

  ngOnInit(): void {
    this.service.onReady().then(() => {
      this.dataSubscription = this.service.getAll().subscribe(manga => {
        const items = [] as BoxItem[];
        manga.forEach(m => items.push(...this.toEpisodeItems(m)));
        this.items = items;
      });
    });
  }

  ngOnDestroy() {
    this.dataSubscription?.unsubscribe();
  }

  private toEpisodeItems( manga: Manga ) {
    const episodes = [] as BoxItem[];
    for (const episode of manga.episodes) {
      episodes.push(new BoxItem(
        `${manga.title} [${episode.number}]`,
        '',
        undefined,
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
        '',
        undefined,
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

  private addManga() {
    this.popUpService.openPopUp(
      KirinoFormComponent.getUrl(MangaFormComponent.TYPE),
      'Add',
      MangaFormComponent.WIDTH,
      MangaFormComponent.HEIGHT
    );
  }

  private editManga( {manga}: DataBag ) {
    this.popUpService.openPopUp(
      KirinoFormComponent.getUrl(MangaFormComponent.TYPE, manga.id),
      'Edit',
      MangaFormComponent.WIDTH,
      MangaFormComponent.HEIGHT
    );
  }

  private deleteManga( {manga}: DataBag ) {
    this.service.delete(manga);
  }

  private markAsSeen( {manga, episode}: DataBag ) {
    const index = manga.episodes.indexOf(episode);
    if (index < 0) {
      return;
    }
    manga.episodes.splice(index, 1);
    manga.lastSeen = Math.max(manga.lastSeen, +episode.number);
    this.service.save(manga)
  }
}
