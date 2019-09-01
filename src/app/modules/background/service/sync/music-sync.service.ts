import { Injectable } from '@angular/core';
import { SongService } from '../../../kirino/services/song.service';
import { AnisonParserService } from '../../../../services/parsers/anison-parser.service';
import { AnidbSongParserService } from '../../../../services/parsers/anidb-song-parser.service';
import { Song } from '../../../kirino/types/song';
import { Preference } from '../../../settings/types/preference';
import { Show } from '../../../kirino/types/show';
import { SyncHelper } from './sync-helper';
import { LocalPreferenceService } from '../../../../services/local-preference.service';
import { MessageService } from '../../../../services/message.service';
import { MusicBoxComponent } from '../../../kirino/components/music-box/music-box.component';

@Injectable({
  providedIn: 'root'
})
export class MusicSyncService {

  private static readonly UPDATE_FIELDS = ['title', 'author', 'releaseDate', 'anisonId'];

  private static readonly ANIDB_SYNC_TIME_KEY = 'LAST_ANIDB_SONG_SYNC';
  private static readonly ANIDB_DELAY = 2 * 60 * 1000;
  private static readonly ANISON_SYNC_TIME_KEY = 'LAST_ANISON_SONG_SYNC';
  private static readonly ANISON_DELAY = 1 * 60 * 1000;

  constructor(
    private musicService: SongService,
    private anisonParser: AnisonParserService,
    private anidbParser: AnidbSongParserService,
    private localPreferenceService: LocalPreferenceService,
    public messageService: MessageService,
  ) {
  }

  public sync( id: number ): Promise<Song> {
    return this.musicService.get(id).then(( song: Song ) => this.syncSong(song));
  }

  private syncSong( song: Song ): Promise<Song> {
    if (!song || (!song.anidbId && !song.anisonId) || song.releaseDate) {
      return Promise.resolve(song);
    }
    return (this.getDataPromise(song)).then(( updatedData: Song ) => {
      this.updateSongData(song, updatedData);
      return this.musicService.save(song).then(() => song);
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

  public syncAll( preference: Preference ): Promise<void>[] {
    return [
      this.syncAllAnidb(preference),
      this.syncAllAnison(preference)
    ];
  }

  private syncAllAnidb( preference: Preference ): Promise<void> {
    return this.localPreferenceService.get(MusicSyncService.ANIDB_SYNC_TIME_KEY, 0).then(( lastSync: number ) => {
      const now = Date.now();
      const nextSync = lastSync + preference.kirino.anidbRefreshRateInMin * 60 * 1000;
      console.log('Checking Song anidb sync, last sync=' + lastSync + ', next sync=' + nextSync);
      if (now < nextSync) {
        console.log('Song anidb sync not needed');
        return Promise.resolve();
      }
      return this.localPreferenceService.set(MusicSyncService.ANIDB_SYNC_TIME_KEY, now).then(() => {
        console.log('Set new Song anidb last sync');
        return this.musicService.getAll();
      }).then(async ( songs: Song[] ) => {
        songs = songs.filter(( s ) => s.anidbId);
        const last = songs[songs.length - 1];
        for (const song of songs) {
          console.log('Syncing Song anidb ' + song.title);
          await this.syncSong(song);
          if (song !== last) {
            await SyncHelper.delay(MusicSyncService.ANIDB_DELAY);
          }
        }
        this.messageService.sendMessage(MusicBoxComponent.SYNC_KEY, 'reload');
        return Promise.resolve();
      });
    });
  }

  private syncAllAnison( preference: Preference ): Promise<void> {
    return this.localPreferenceService.get(MusicSyncService.ANISON_SYNC_TIME_KEY, 0).then(( lastSync: number ) => {
      const now = Date.now();
      const nextSync = lastSync + preference.kirino.anidbRefreshRateInMin * 60 * 1000;
      console.log('Checking Song anison sync, last sync=' + lastSync + ', next sync=' + nextSync);
      if (now < nextSync) {
        console.log('Song anison sync not needed');
        return Promise.resolve();
      }
      return this.localPreferenceService.set(MusicSyncService.ANISON_SYNC_TIME_KEY, now).then(() => {
        console.log('Set new Song anison last sync');
        return this.musicService.getAll();
      }).then(async ( songs: Song[] ) => {
        songs = songs.filter(( s ) => s.anisonId);
        const last = songs[songs.length - 1];
        for (const song of songs) {
          console.log('Syncing Song anison ' + song.title);
          await this.syncSong(song);
          if (song !== last) {
            await SyncHelper.delay(MusicSyncService.ANISON_DELAY);
          }
        }
        this.messageService.sendMessage(MusicBoxComponent.SYNC_KEY, 'reload');
        return Promise.resolve();
      });
    });
  }
}
