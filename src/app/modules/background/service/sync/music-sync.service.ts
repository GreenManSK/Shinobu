import { Injectable } from '@angular/core';
import { SongService } from '../../../kirino/services/song.service';
import { AnisonParserService } from '../../../../services/parsers/anison-parser.service';
import { AnidbSongParserService } from '../../../../services/parsers/anidb-song-parser.service';
import { Song } from '../../../kirino/types/song';

@Injectable({
  providedIn: 'root'
})
export class MusicSyncService {

  private static readonly UPDATE_FIELDS = ['title', 'author', 'releaseDate', 'anisonId'];

  constructor(
    private musicService: SongService,
    private anisonParser: AnisonParserService,
    private anidbParser: AnidbSongParserService
  ) {
  }

  public sync( id: number ): Promise<Song> {
    return this.musicService.get(id).then(( song: Song ) => {
      if (!song || (!song.anidbId && !song.anisonId) || song.releaseDate) {
        return song;
      }
      return (this.getDataPromise(song)).then(( updatedData: Song ) => {
        this.updateSongData(song, updatedData);
        return this.musicService.save(song).then(() => song);
      });
    });
  }

  private getDataPromise( song: Song ): Promise<any> {
    return song.anisonId ?
      this.anisonParser.getData(AnisonParserService.getUrl(song.anisonId)) :
      this.anidbParser.getData(AnidbSongParserService.getUrl(song.anidbId));
  }

  private updateSongData( song: Song, updatedData: Song ): void {
    for (const field of MusicSyncService.UPDATE_FIELDS) {
      if (updatedData[field]) {
        song[field] = updatedData[field];
      }
    }
  }
}
