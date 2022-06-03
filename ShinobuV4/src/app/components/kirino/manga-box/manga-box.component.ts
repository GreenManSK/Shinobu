import {Component, OnDestroy, OnInit} from '@angular/core';
import {Color} from '../../../types/Color';
import {Episode} from '../../../data/kirino/Episode';
import {Manga} from '../../../data/kirino/Manga';
import {BoxItem} from '../../../types/kirino/BoxItem';
import {BoxButton} from '../../../types/kirino/BoxButton';
import {Subscription} from 'rxjs';
import {PopUpService} from '../../../services/pop-up.service';
import {MangaService} from '../../../services/data/kirino/manga.service';
import {BoxLink} from '../../../types/kirino/BoxLink';
import {MangaParserService} from '../../../services/parsers/kirino/manga-parser.service';
import {KirinoFormComponent} from '../kirino-form/kirino-form.component';
import {MangaFormComponent} from '../manga-form/manga-form.component';
import {MangaSyncService} from '../../../services/sync/kirino/manga-sync.service';
import {InternetConnectionService} from '../../../services/internet-connection.service';

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
  public headerButtons = [
    new BoxButton('Add', 'ri-add-box-line', () => this.addManga()),
    new BoxButton('Sync all', 'ri-refresh-line', () => this.syncAll()),
  ];

  private buttons: BoxButton[] = [
    new BoxButton('Mark as seen', 'ri-eye-line', (bag: DataBag) => this.markAsSeen(bag)),
    new BoxButton('Edit', 'ri-edit-2-line', (bag: DataBag) => this.editManga(bag)),
    new BoxButton('Delete', 'ri-delete-bin-6-line', (bag: DataBag) => this.deleteManga(bag))
  ];
  private dataSubscription?: Subscription;
  private internetSubscription?: Subscription;

  constructor(
    private service: MangaService,
    private popUpService: PopUpService,
    private syncService: MangaSyncService,
    private internetConnectionService: InternetConnectionService
  ) {
  }

  ngOnInit(): void {
    this.internetSubscription = this.internetConnectionService.asObservable().subscribe(connected => {
      this.headerButtons[1].disabled = !connected;
    });
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
    this.internetSubscription?.unsubscribe();
  }

  private toEpisodeItems(manga: Manga) {
    const episodes = [] as BoxItem[];
    const sortedEpisodes = manga.episodes.sort((a, b) => manga.parseEpisodeNumber(a.number) - manga.parseEpisodeNumber(b.number));
    for (const episode of sortedEpisodes) {
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
        this.buttons,
        undefined,
        this.syncService.isSynced(manga)
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
        this.buttons.slice(1, 3),
        undefined,
        this.syncService.isSynced(manga)
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

  private editManga({manga}: DataBag) {
    this.popUpService.openPopUp(
      KirinoFormComponent.getUrl(MangaFormComponent.TYPE, manga.id),
      'Edit',
      MangaFormComponent.WIDTH,
      MangaFormComponent.HEIGHT
    );
  }

  private deleteManga({manga}: DataBag) {
    this.service.delete(manga);
  }

  private markAsSeen({manga, episode}: DataBag) {
    const index = manga.episodes.indexOf(episode);
    if (index < 0) {
      return;
    }
    manga.episodes.splice(index, 1);
    manga.lastSeen = Math.max(manga.lastSeen, manga.parseEpisodeNumber(episode.number));
    this.service.save(manga)
  }

  public syncItem(item: BoxItem) {
    const manga = item.data.manga as Manga;
    this.syncService.sync(manga, true, true);
  }

  private syncAll() {
    this.syncService.syncAll(false, true);
  }
}
