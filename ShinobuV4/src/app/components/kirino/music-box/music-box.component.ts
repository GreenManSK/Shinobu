import { Component, OnDestroy, OnInit } from '@angular/core';
import { Color } from '../../../types/Color';
import { BoxButton } from '../../../types/kirino/BoxButton';
import { Subscription } from 'rxjs';
import { Song } from '../../../data/kirino/Song';
import { SongService } from '../../../services/data/kirino/song.service';
import { PopUpService } from '../../../services/pop-up.service';
import { BoxItem } from '../../../types/kirino/BoxItem';
import { BoxLink } from '../../../types/kirino/BoxLink';
import { AnidbSongParserService } from '../../../services/parsers/kirino/anidb-song-parser.service';
import { AnisonParserService } from '../../../services/parsers/kirino/anison-parser.service';
import { KirinoFormComponent } from '../kirino-form/kirino-form.component';
import { MusicFormComponent } from '../music-form/music-form.component';
import { MusicSyncService } from '../../../services/sync/kirino/music-sync.service';
import { InternetConnectionService } from '../../../services/internet-connection.service';

@Component({
  selector: 'music-box',
  templateUrl: './music-box.component.html',
  styleUrls: ['./music-box.component.scss']
})
export class MusicBoxComponent implements OnInit, OnDestroy {

  public readonly color = Color.Blue;

  public items: BoxItem[] = [];
  public headerButtons = [
    new BoxButton('Add', 'ri-add-box-line', () => this.addSong()),
    new BoxButton('Sync all', 'ri-refresh-line', () => this.syncAll()),
  ];

  private buttons: BoxButton[] = [
    new BoxButton('Edit', 'ri-edit-2-line', ( song: Song ) => this.editSong(song)),
    new BoxButton('Delete', 'ri-delete-bin-6-line', ( song: Song ) => this.deleteSong(song))
  ];
  private dataSubscription?: Subscription;
  private internetSubscription?: Subscription;

  constructor(
    private service: SongService,
    private popUpService: PopUpService,
    private sync: MusicSyncService,
    private internetConnectionService: InternetConnectionService
  ) {
  }

  ngOnInit(): void {
    this.internetSubscription = this.internetConnectionService.asObservable().subscribe(connected => {
      this.headerButtons[1].disabled = !connected;
    });
    this.service.onReady().then(() => {
      this.dataSubscription = this.service.getAll().subscribe(songs => {
        this.items = songs.map(song => this.toBoxItem(song));
      });
    });
  }

  ngOnDestroy() {
    this.dataSubscription?.unsubscribe();
    this.internetSubscription?.unsubscribe();
  }

  private toBoxItem( song: Song ): BoxItem {
    const badges = [];
    if (song.anidbId) {
      badges.push(new BoxLink('aniDB.net', AnidbSongParserService.getUrl(song.anidbId)));
    }
    if (song.anisonId) {
      badges.push(new BoxLink('Anison', AnisonParserService.getUrl(song.anisonId)));
    }
    return new BoxItem(
      `${song.show} - ${song.type}`,
      `${song.title ? song.title : ''}${song.author ? ` - ${song.author}` : ''}`,
      song.releaseDate ? new Date(song.releaseDate) : undefined,
      null,
      song,
      badges,
      this.buttons,
      undefined,
      this.sync.isSynced(song)
    );
  }

  private addSong() {
    this.popUpService.openPopUp(
      KirinoFormComponent.getUrl(MusicFormComponent.TYPE),
      'Add',
      MusicFormComponent.WIDTH,
      MusicFormComponent.HEIGHT
    );
  }

  private editSong( song: Song ) {
    this.popUpService.openPopUp(
      KirinoFormComponent.getUrl(MusicFormComponent.TYPE, song.id),
      'Edit',
      MusicFormComponent.WIDTH,
      MusicFormComponent.HEIGHT
    );
  }

  private deleteSong( song: Song ) {
    this.service.delete(song);
  }

  public syncItem( item: BoxItem ) {
    const song = item.data as Song;
    this.sync.sync(song, true, true);
  }

  private syncAll() {
    this.sync.syncAll(false, true);
  }
}
