import { Component, Input, OnInit } from '@angular/core';
import { ChromeMockStorageService } from '../../../mocks/chrome-mock-storage.service';
import { MessageService } from '../../../services/message.service';
import { BoxComponent } from '../box/box.component';
import { BoxColor } from '../box/box-color.enum';
import { SongService } from '../../services/song.service';
import { Song } from '../../types/song';
import { MusicBoxComponent } from '../music-box/music-box.component';

@Component({
  selector: 'music-form',
  templateUrl: './music-form.component.html',
  styleUrls: ['./music-form.component.scss']
})
export class MusicFormComponent implements OnInit {

  public static readonly TYPE = 'music';
  public static readonly WIDTH = 600;
  public static readonly HEIGHT = 500;

  public readonly color = BoxColor.Blue;
  private service: SongService;

  public _id: number;
  public song: Song;

  constructor(
    chromeStorage: ChromeMockStorageService,
    public messageService: MessageService
  ) {
    this.service = new SongService(chromeStorage);
  }

  ngOnInit() {
  }

  @Input('id')
  public set id( id: number ) {
    this._id = id;
    if (id) {
      this.service.get(id).then(( song: Song ) => this.song = song);
    } else {
      this.song = new Song(null, null, null, null, Date.now());
    }
  }

  public save(): void {
    this.service.save(this.song).then(() => {
      this.messageService.sendMessage(MusicBoxComponent.SYNC_KEY, 'reload');
      window.close();
    });
  }


  public get colorClass() {
    return BoxComponent.getColorClass(this.color);
  }

  public updateReleaseDate( date: string ): void {
    this.song.releaseDate = new Date(date).getTime();
  }

}
