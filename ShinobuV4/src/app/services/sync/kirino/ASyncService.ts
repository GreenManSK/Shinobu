import { ISyncService } from './isync-service';
import { ISyncable } from '../../../data/kirino/ISyncable';
import { KirinoSettingsService } from '../../data/kirino/kirino-settings.service';
import { AlertService } from '../../alert.service';
import { AlertType } from '../../../types/AlertType';
import { Alert } from '../../../types/Alert';

export abstract class ASyncService<T extends ISyncable> implements ISyncService<T> {

  constructor( private kirinoSettingsService: KirinoSettingsService, protected alertService: AlertService ) {

  }

  public abstract sync( item: T, force: boolean, log: boolean ): Promise<T>;

  public syncAll( force: boolean, log: boolean ): Promise<void> {
    const dismissSyncingAlert = this.alertService.publish(new Alert(this.getName(), 'Syncing', AlertType.warning, true));
    return this.syncAllItems(force, log).then(() => {
      dismissSyncingAlert();
      this.log(true, 'Finished', AlertType.success);
    });
  }

  protected abstract syncAllItems( force: boolean, log: boolean ): Promise<void>;

  protected abstract getName(): string;

  protected shouldSync( item: T, syncKey: string, defaultValue: number ) {
    const syncTimeInMins = this.kirinoSettingsService.get()?.refreshRatesInMins[syncKey] || defaultValue;
    const now = Date.now();
    const nextSync = (item.lastSync || 0) + syncTimeInMins * 60 * 1000;
    return nextSync < now;
  }

  protected log( createAlert: boolean, message: string, type: AlertType = AlertType.warning ) {
    if (createAlert) {
      this.alertService.publish(new Alert(this.getName(), message, type));
    } else {
      const consoleFn = type === AlertType.error ? console.error : type === AlertType.warning ? console.warn : console.log;
      consoleFn(`${this.getName()}: ${message}`);
    }
  }

}
