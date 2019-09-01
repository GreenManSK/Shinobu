import { Injectable } from '@angular/core';
import { OvaService } from '../../../kirino/services/ova.service';
import { AnidbEpisodeParserService } from '../../../../services/parsers/anidb-episode-parser.service';
import { Ova } from '../../../kirino/types/ova';
import { LocalPreferenceService } from '../../../../services/local-preference.service';
import { Preference } from '../../../settings/types/preference';
import { OvaBoxComponent } from '../../../kirino/components/ova-box/ova-box.component';
import { MessageService } from '../../../../services/message.service';
import { SyncHelper } from './sync-helper';

@Injectable({
  providedIn: 'root'
})
export class OvaSyncService {

  private static readonly SYNC_TIME_KEY = 'LAST_OVA_SYNC';
  private static readonly DELAY = 2.7 * 60 * 1000;

  constructor(
    private ovaService: OvaService,
    private ovaParser: AnidbEpisodeParserService,
    private localPreferenceService: LocalPreferenceService,
    public messageService: MessageService,
  ) {

  }

  public sync( id: number ): Promise<Ova> {
    return this.ovaService.get(id).then(( ova: Ova ) => {
      return this.syncOva(ova);
    });
  }

  private syncOva( ova: Ova ): Promise<Ova> {
    if (!ova || !ova.anidbId || ova.airdate) {
      return Promise.resolve(ova);
    }
    const url = AnidbEpisodeParserService.getUrl(ova.anidbId);
    return this.ovaParser.getData(url).then(( updatedData: Ova ) => {
      if (updatedData && updatedData.airdate) {
        ova.airdate = updatedData.airdate;
        return this.ovaService.save(ova).then(() => ova);
      }
      return ova;
    });
  }

  public syncAll( preference: Preference ): Promise<void> {
    return this.localPreferenceService.get(OvaSyncService.SYNC_TIME_KEY, 0).then(( lastSync: number ) => {
      const now = Date.now();
      const nextSync = lastSync + preference.kirino.anidbRefreshRateInMin * 60 * 1000;
      console.log('Checking OVA sync, last sync=' + lastSync + ', next sync=' + nextSync);
      if (now < nextSync) {
        console.log('OVA sync not needed');
        return Promise.resolve();
      }
      return this.localPreferenceService.set(OvaSyncService.SYNC_TIME_KEY, now).then(() => {
        console.log('Set new OVA last sync');
        return this.ovaService.getAll();
      }).then(async ( ovas: Ova[] ) => {
        const last = ovas[ovas.length - 1];
        for (const ova of ovas) {
          console.log('Syncing OVA ' + ova.title);
          await this.syncOva(ova);
          if (ova !== last) {
            await SyncHelper.delay(OvaSyncService.DELAY);
          }
        }
        this.messageService.sendMessage(OvaBoxComponent.SYNC_KEY, 'reload');
        return Promise.resolve();
      });
    });
  }
}
