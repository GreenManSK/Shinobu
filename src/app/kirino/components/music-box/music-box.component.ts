import { Component, NgZone, OnInit } from '@angular/core';
import { BoxColor } from '../box/box-color.enum';
import { BoxItem } from '../item-box/data/BoxItem';
import { BoxButton } from '../item-box/data/BoxButton';
import { ChromeMockStorageService } from '../../../mocks/chrome-mock-storage.service';
import { BoxLink } from '../item-box/data/BoxLink';
import { SongService } from '../../services/song.service';
import { Song } from '../../types/song';
import { MessageService } from '../../../services/message.service';
import { PopUpService } from '../../../services/pop-up.service';
import { KirinoFormComponent } from '../kirino-form/kirino-form.component';
import { MusicFormComponent } from '../music-form/music-form.component';
import { AnidbSongParserService } from '../../../service/parsers/anidb-song-parser.service';

@Component({
  selector: 'music-box',
  templateUrl: './music-box.component.html',
  styleUrls: ['./music-box.component.scss']
})
export class MusicBoxComponent implements OnInit {

  public static readonly SYNC_KEY = 'MusicBox';

  public readonly color = BoxColor.Blue;
  public readonly syncKey = MusicBoxComponent.SYNC_KEY;

  private service: SongService;
  public items: BoxItem[] = [];

  private buttons: BoxButton[] = [
    new BoxButton('Edit', 'pencil', this.editMusic.bind(this)),
    new BoxButton('Delete', 'trash-o', this.deleteMusic.bind(this))
  ];

  public addButton = new BoxButton('Add', 'plus', this.addMusic.bind(this));

  constructor(
    public popUpService: PopUpService,
    private zone: NgZone,
    chromeStorage: ChromeMockStorageService,
    messageService: MessageService
  ) {
    this.service = new SongService(chromeStorage);
    messageService.onMessage(this.syncKey, () => {
      this.zone.run(() => {
        this.reloadItems();
      });
    });
  }

  ngOnInit() {
    this.reloadItems();
  }

  public synchronizeMusic( item: BoxItem ): void {
    // TODO
  }

  public addMusic(): void {
    this.popUpService.openPopUp(
      KirinoFormComponent.getUrl(MusicFormComponent.TYPE),
      'Add',
      MusicFormComponent.WIDTH,
      MusicFormComponent.HEIGHT
    );
  }

  public editMusic( song: Song ): void {
    this.popUpService.openPopUp(
      KirinoFormComponent.getUrl(MusicFormComponent.TYPE, song.id),
      'Edit',
      MusicFormComponent.WIDTH,
      MusicFormComponent.HEIGHT
    );
  }

  public deleteMusic( song: Song ): void {
    this.service.delete(song).then(() => {
      this.reloadItems();
    });
  }


  private reloadItems(): void {
    this.service.getAll().then(( songs: Song[] ) => {
      const items = [];
      songs.forEach(song => items.push(this.toBoxItem(song)));
      this.items = items;
    });
  }

  private toBoxItem( song: Song ): BoxItem {
    const badges = [];
    if (song.anidbId) {
      badges.push(new BoxLink('aniDB.net', AnidbSongParserService.getUrl(song.id)));
    }
    if (song.anisonId) {
      badges.push(new BoxLink('Anison', '')); // TODO: Add real url
    }
    return new BoxItem(
      song.show + ' - ' + song.type,
      song.title + (song.author ? ' - ' + song.author : ''),
      new Date(song.releaseDate),
      null,
      song,
      badges,
      this.buttons
    );
  }
}
