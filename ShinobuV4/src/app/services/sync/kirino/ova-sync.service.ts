import { Injectable } from '@angular/core';
import { ASyncService } from './ASyncService';
import { Ova } from '../../../data/kirino/Ova';
import { KirinoSettingsService } from '../../data/kirino/kirino-settings.service';
import { AlertService } from '../../alert.service';
import { OvaService } from '../../data/kirino/ova.service';
import { AnidbEpisodeParserService } from '../../parsers/kirino/anidb-episode-parser.service';
import { AnimeSyncService } from './anime-sync.service';

@Injectable({
  providedIn: 'root'
})
export class OvaSyncService extends ASyncService<Ova> {

  private static readonly DELAY = 0.7 * 60 * 1000;

  constructor(
    kirinoSettingsService: KirinoSettingsService,
    alertService: AlertService,
    private service: OvaService,
    private parser: AnidbEpisodeParserService
  ) {
    super(kirinoSettingsService, alertService);
  }

  public sync( item: Ova, force = false, log = false): Promise<Ova> {
    if (!item.anidbId) {
      return Promise.resolve(item);
    }
    const shouldSync = force || this.shouldSync(item, AnimeSyncService.SYNC_KEY, AnimeSyncService.DEFAULT_SYNC_TIME_IN_MINS);
    this.log(log, `${item.id}/${item.title} (force: ${force ? 'yes' : 'no'}) - ${shouldSync ? 'syncing' : 'skipping'}`);
    if (!shouldSync) {
      return Promise.resolve(item);
    }
    const url = AnidbEpisodeParserService.getUrl(item.anidbId);
    return this.parser.getData(url).then(updatedData => {
      if (updatedData && updatedData.airdate) {
        item.airdate = updatedData.airdate;
      }
      item.lastSync = Date.now();
      return this.service.save(item);
    });
  }

  public override syncAll( force: boolean, log: boolean ): Promise<void> {
    return this.syncAllItems(force, log, this.service, OvaSyncService.DELAY);
  }

  protected getName(): string {
    return 'OvaSync';
  }


}
