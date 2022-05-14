import { Injectable } from '@angular/core';
import { ASyncService } from './ASyncService';
import { Song } from '../../../data/kirino/Song';
import { KirinoSettingsService } from '../../data/kirino/kirino-settings.service';
import { AlertService } from '../../alert.service';
import { SongService } from '../../data/kirino/song.service';
import { AnidbSongParserService } from '../../parsers/kirino/anidb-song-parser.service';
import { AnisonParserService } from '../../parsers/kirino/anison-parser.service';
import { AnimeSyncService } from './anime-sync.service';

@Injectable({
  providedIn: 'root'
})
export class MusicSyncService extends ASyncService<Song> {

  public static readonly ANISON_SYNC_KEY = 'anison';
  public static readonly ANISON_DEFAULT_SYNC_TIME_IN_MINS = 24 * 60;

  private static readonly ANIDB_DELAY = 0.63 * 60 * 1000;
  private static readonly ANISON_DELAY = 0.5 * 60 * 1000;
  private static readonly UPDATE_FIELDS = ['title', 'author', 'releaseDate', 'anisonId'];

  constructor(
    kirinoSettingsService: KirinoSettingsService,
    alertService: AlertService,
    private service: SongService,
    private anidbParser: AnidbSongParserService,
    private anisonParser: AnisonParserService
  ) {
    super(kirinoSettingsService, alertService);
  }

  public sync( item: Song, force = false, log = false ): Promise<Song> {
    if (!item.anisonId && !item.anidbId) {
      return Promise.resolve(item);
    }

    let shouldSync = force;
    const useAnison = this.shouldUseAnison(item);
    if (!shouldSync) {
      if (useAnison) {
        shouldSync = this.shouldSync(item, MusicSyncService.ANISON_SYNC_KEY, MusicSyncService.ANISON_DEFAULT_SYNC_TIME_IN_MINS);
      } else {
        shouldSync = this.shouldSync(item, AnimeSyncService.SYNC_KEY, AnimeSyncService.DEFAULT_SYNC_TIME_IN_MINS);
      }
    }

    this.log(log, `${item.id}/${item.title} (force: ${force ? 'yes' : 'no'}) - ${shouldSync ? 'syncing' : 'skipping'}`);
    if (!shouldSync) {
      return Promise.resolve(item);
    }

    return this.getDataPromise(item).then(updatedData => {
      this.updateSongData(item, updatedData);
      item.lastSync = Date.now();
      return this.service.save(item);
    });
  }

  public syncAll( force: boolean, log: boolean ): Promise<void> {
    const promises = [
      this.syncAllItems(force, log, this.service, MusicSyncService.ANIDB_DELAY, (item) => !this.shouldUseAnison(item)),
      this.syncAllItems(force, log, this.service, MusicSyncService.ANISON_DELAY, (item) => this.shouldUseAnison(item)),
    ];
    return Promise.all(promises).then(() => {});
  }

  protected getName(): string {
    return 'MusicSync';
  }

  private shouldUseAnison( song: Song ): boolean {
    return !!song.anisonId;
  }

  private getDataPromise( song: Song ): Promise<any> {
return this.shouldUseAnison(song) ?
      this.anisonParser.getData(AnisonParserService.getUrl(song.anisonId)) :
      this.anidbParser.getData(AnidbSongParserService.getUrl(song.anidbId));
  }

  private updateSongData( song: Song, updatedData: any ) {
    if (!updatedData) {
      return;
    }
    for (const field of MusicSyncService.UPDATE_FIELDS) {
      // @ts-ignore
      if (!song[field] && updatedData[field]) {
        // @ts-ignore
        song[field] = updatedData[field];
      }
    }
  }
}
