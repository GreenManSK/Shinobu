import { Injectable } from '@angular/core';
import { ASyncService } from './ASyncService';
import { Ova } from '../../../data/kirino/Ova';
import { KirinoSettingsService } from '../../data/kirino/kirino-settings.service';
import { AlertService } from '../../alert.service';
import { OvaService } from '../../data/kirino/ova.service';
import { AnidbEpisodeParserService } from '../../parsers/kirino/anidb-episode-parser.service';
import { AnimeSyncService } from './anime-sync.service';
import { InternetConnectionService } from '../../internet-connection.service';
import { AlertType } from '../../../types/AlertType';

@Injectable({
  providedIn: 'root'
})
export class OvaSyncService extends ASyncService<Ova> {

  private static readonly DELAY = 0.7 * 60 * 1000;

  constructor(
    kirinoSettingsService: KirinoSettingsService,
    alertService: AlertService,
    private service: OvaService,
    private parser: AnidbEpisodeParserService,
    private internetConnectionService: InternetConnectionService
  ) {
    super(kirinoSettingsService, alertService);
  }

  public sync( item: Ova, force = false, log = false): Promise<Ova> {
    if (!this.internetConnectionService.isConnected()) {
      return Promise.resolve(item);
    }
    if (!item.anidbId || item.airdate) {
      return Promise.resolve(item);
    }
    const shouldSync = force || !this.isSynced(item);
    if (!shouldSync) {
      return Promise.resolve(item);
    }
    const dismissAlert = this.log(log, `${item.id}/${item.title} (force: ${force ? 'yes' : 'no'}) - ${shouldSync ? 'syncing' : 'skipping'}`, AlertType.warning, shouldSync);
    const url = AnidbEpisodeParserService.getUrl(item.anidbId);
    return this.parser.getData(url).then(updatedData => {
      if (updatedData && updatedData.airdate) {
        item.airdate = updatedData.airdate;
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
    return this.syncAllItems(force, log, this.service, OvaSyncService.DELAY);
  }

  public isSynced(item: Ova): boolean {
    return !this.shouldSync(item, AnimeSyncService.SYNC_KEY, AnimeSyncService.DEFAULT_SYNC_TIME_IN_MINS);
  }

  protected getName(): string {
    return 'OvaSync';
  }


}
