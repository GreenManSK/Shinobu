import { Component, NgZone, OnInit } from '@angular/core';
import { BoxColor } from '../box/box-color.enum';
import { BoxItem } from '../item-box/data/BoxItem';
import { BoxButton } from '../item-box/data/BoxButton';
import { ChromeMockStorageService } from '../../../mocks/chrome-mock-storage.service';
import { BoxLink } from '../item-box/data/BoxLink';
import { SongService } from '../../services/song.service';
import { Song } from '../../types/song';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'music-box',
  templateUrl: './music-box.component.html',
  styleUrls: ['./music-box.component.scss']
})
export class MusicBoxComponent implements OnInit {

  public readonly color = BoxColor.Blue;
  public readonly syncKey = 'MusicBox';

  private service: SongService;
  public items: BoxItem[] = [];

  private buttons: BoxButton[] = [
    new BoxButton('Edit', 'pencil', this.editMusic.bind(this)),
    new BoxButton('Delete', 'trash-o', this.deleteMusic.bind(this))
  ];

  constructor(
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
    // TODO: Remove mocks
    const songs = [
      new Song('Naruto', 'END', 'bla bla bla', 'otor', 1566642691787),
      new Song('Naruto', 'END', 'bla bla bla', 'otor', 1566642691787, 555),
      new Song('Naruto', 'END', 'bla bla bla', 'otor', 1566642691787, null, 567),
      new Song('Naruto', 'END', 'bla bla bla', 'otor', 1666642691787, 1, 2),
    ];
    for (const show of songs) {
      this.service.save(show);
    }
  }

  ngOnInit() {
    this.reloadItems();
  }

  public synchronizeMusic( item: BoxItem ): void {
    // TODO
  }

  public editMusic( song: Song ): void {
    // TODO
    console.log('edit');
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
      badges.push(new BoxLink('aniDB.net', '')); // TODO: Add real url
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
