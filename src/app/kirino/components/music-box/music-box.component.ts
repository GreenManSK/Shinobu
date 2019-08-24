import { Component, OnInit } from '@angular/core';
import { BoxColor } from '../box/box-color.enum';
import { BoxItem } from '../box/data/BoxItem';
import { BoxButton } from '../box/data/BoxButton';
import { ChromeMockStorageService } from '../../../mocks/chrome-mock-storage.service';
import { BoxLink } from '../box/data/BoxLink';
import { SongService } from '../../services/song.service';
import { Song } from "../../types/song";

@Component({
  selector: 'music-box',
  templateUrl: './music-box.component.html',
  styleUrls: ['./music-box.component.scss']
})
export class MusicBoxComponent implements OnInit {

  private readonly color = BoxColor.Blue;
  private readonly syncKey = 'MusicBox';

  private service: SongService;
  private items: BoxItem[] = [];

  private buttons: BoxButton[] = [
    new BoxButton('Edit', 'pencil', this.editMusic),
    new BoxButton('Delete', 'trash-o', this.deleteMusic)
  ];

  constructor(
    chromeStorage: ChromeMockStorageService
  ) {
    this.service = new SongService(chromeStorage);
  }

  ngOnInit() {
    this.reloadItems();
  }

  public synchronizeMusic( item: BoxItem ): void {
    // TODO
  }

  public editMusic( id: number ): void {
    // TODO
    console.log('edit');
  }

  public deleteMusic( id: number ): void {
    // TODO
    console.log('delete');
  }


  private reloadItems(): void {
    this.service.getAll().then(( songs: Song[] ) => {
      songs = [
        new Song('Naruto', 'END', 'bla bla bla', 'otor', 1566642691787),
        new Song('Naruto', 'END', 'bla bla bla', 'otor', 1566642691787, 555),
        new Song('Naruto', 'END', 'bla bla bla', 'otor', 1566642691787, null, 567),
        new Song('Naruto', 'END', 'bla bla bla', 'otor', 1666642691787, 1, 2),
      ];
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
      song.id,
      badges,
      this.buttons
    );
  }
}
