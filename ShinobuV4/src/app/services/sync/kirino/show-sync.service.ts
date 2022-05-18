import { Injectable } from '@angular/core';
import { ASyncService } from './ASyncService';
import { Show } from '../../../data/kirino/Show';
import { KirinoSettingsService } from '../../data/kirino/kirino-settings.service';
import { AlertService } from '../../alert.service';
import { ShowService } from '../../data/kirino/show.service';
import { TheTVDBParserService } from '../../parsers/kirino/the-tvdbparser.service';
import { EpisodeSyncHelper } from './episode-sync-helper';
import { InternetConnectionService } from '../../internet-connection.service';
import { AlertType } from '../../../types/AlertType';

@Injectable({
  providedIn: 'root'
})
export class ShowSyncService extends ASyncService<Show> {

  public static readonly SYNC_KEY = 'tvdb';
  public static readonly DEFAULT_SYNC_TIME_IN_MINS = 4 * 60;
  private static readonly DELAY = 0.7 * 60 * 1000;

  constructor(
    kirinoSettingsService: KirinoSettingsService,
    alertService: AlertService,
    private service: ShowService,
    private parser: TheTVDBParserService,
    private internetConnectionService: InternetConnectionService
  ) {
    super(kirinoSettingsService, alertService);
  }

  public sync( item: Show, force = false, log = false ): Promise<Show> {
    if (!this.internetConnectionService.isConnected()) {
      return Promise.resolve(item);
    }
    const shouldSync = force || this.shouldSync(item, ShowSyncService.SYNC_KEY, ShowSyncService.DEFAULT_SYNC_TIME_IN_MINS);
    if (!shouldSync) {
      return Promise.resolve(item);
    }
    const dismissAlert = this.log(log, `${item.id}/${item.title} (force: ${force ? 'yes' : 'no'}) - ${shouldSync ? 'syncing' : 'skipping'}`, AlertType.warning, shouldSync);
    const url = TheTVDBParserService.getUrl(item.tvdbId);

    return this.parser.getData(url).then(updatedData => {
      if (updatedData) {
        EpisodeSyncHelper.updateEpisodes(item, updatedData.episodes);
      }
      item.lastSync = Date.now();
      return this.service.save(item);
    }).then(item => {
      dismissAlert?.();
      return item;
    }).catch(item => {
      this.log(log, `Problem syncing ${item.id}/${item.title}`, AlertType.error)
      return item;
    });
  }

  public syncAll( force: boolean, log: boolean ): Promise<void> {
    return this.syncAllItems(force, log, this.service, ShowSyncService.DELAY);
  }

  protected getName(): string {
    return 'ShowSync';
  }


}
