import { Injectable } from '@angular/core';
import { ShowService } from '../../../kirino/services/show.service';
import { TheTVDBParserService } from '../../../../services/parsers/the-tvdbparser.service';
import { Show } from '../../../kirino/types/show';
import { EpisodeSyncHelper } from './episode-sync-helper';
import { Preference } from '../../../settings/types/preference';
import { SyncHelper } from './sync-helper';
import { LocalPreferenceService } from '../../../../services/local-preference.service';
import { MessageService } from '../../../../services/message.service';
import { ShowsBoxComponent } from '../../../kirino/components/shows-box/shows-box.component';

@Injectable({
  providedIn: 'root'
})
export class ShowSyncService {

  private static readonly SYNC_TIME_KEY = 'LAST_SHOW_SYNC';
  private static readonly DELAY = 0.7 * 60 * 1000;

  constructor(
    private showService: ShowService,
    private showParser: TheTVDBParserService,
    private localPreferenceService: LocalPreferenceService,
    public messageService: MessageService,
  ) {
  }

  public sync( id: number ): Promise<Show> {
    return this.showService.get(id).then(( show: Show ) => this.syncShow(show));
  }

  private syncShow( show: Show ): Promise<Show> {
    if (!show || !show.tvdbId) {
      return Promise.resolve(show);
    }
    const url = TheTVDBParserService.getUrl(show.tvdbId);
    return this.showParser.getData(url).then(( updatedData: Show ) => {
      if (updatedData) {
        EpisodeSyncHelper.updateEpisodes(show, updatedData.episodes);
        return this.showService.save(show).then(() => show);
      }
      return show;
    });
  }

  public syncAll( preference: Preference ): Promise<void> {
    return this.localPreferenceService.get(ShowSyncService.SYNC_TIME_KEY, 0).then(( lastSync: number ) => {
      const now = Date.now();
      const nextSync = lastSync + preference.kirino.anidbRefreshRateInMin * 60 * 1000;
      console.log('Checking Show sync, last sync=' + lastSync + ', next sync=' + nextSync);
      if (now < nextSync) {
        console.log('Show sync not needed');
        return Promise.resolve();
      }
      return this.localPreferenceService.set(ShowSyncService.SYNC_TIME_KEY, now).then(() => {
        console.log('Set new Show last sync');
        return this.showService.getAll();
      }).then(async ( shows: Show[] ) => {
        const last = shows[shows.length - 1];
        for (const show of shows) {
          console.log('Syncing Show ' + show.title);
          await this.syncShow(show);
          if (show !== last) {
            await SyncHelper.delay(ShowSyncService.DELAY);
          }
        }
        this.messageService.sendMessage(ShowsBoxComponent.SYNC_KEY, 'reload');
        return Promise.resolve();
      });
    });
  }
}
