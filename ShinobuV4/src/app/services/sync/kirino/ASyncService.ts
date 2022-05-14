import { ISyncService } from './isync-service';
import { ISyncable } from '../../../data/kirino/ISyncable';
import { KirinoSettingsService } from '../../data/kirino/kirino-settings.service';
import { AlertService } from '../../alert.service';
import { AlertType } from '../../../types/AlertType';
import { Alert } from '../../../types/Alert';
import { IStorageService } from '../../data/istorage-service';
import { first } from 'rxjs';
import { SyncHelper } from './sync-helper';

export abstract class ASyncService<T extends ISyncable> implements ISyncService<T> {

  constructor( private kirinoSettingsService: KirinoSettingsService, protected alertService: AlertService ) {

  }

  public abstract sync( item: T, force: boolean, log: boolean ): Promise<T>;

  public abstract syncAll( force: boolean, log: boolean ): Promise<void>;

  protected abstract getName(): string;

  protected shouldSync( item: T, syncKey: string, defaultValue: number ) {
    const syncTimeInMins = this.kirinoSettingsService.get()?.refreshRatesInMins[syncKey] || defaultValue;
    const now = Date.now();
    const nextSync = (item.lastSync || 0) + syncTimeInMins * 60 * 1000;
    return nextSync < now;
  }

  protected log( createAlert: boolean, message: string, type: AlertType = AlertType.warning, permanent = false ) {
    if (createAlert) {
      return this.alertService.publish(new Alert(this.getName(), message, type, permanent));
    } else {
      const consoleFn = type === AlertType.error ? console.error : type === AlertType.warning ? console.warn : console.log;
      consoleFn(`${this.getName()}: ${message}`);
    }
    return () => {};
  }

  protected syncAllItems( force: boolean, log: boolean, service: IStorageService<T>, delay: number, filter: ( item: T ) => boolean = () => true ): Promise<void> {
    const syncAlertDismiss = this.log(log, 'Syncing');

    return new Promise<void>(resolve => {
      service.onReady().then(() => {
        service.getAll().pipe(first()).subscribe(async items => {
          items = items.filter(filter).sort((a,b) => (a.lastSync || 0) - (b.lastSync || 0));
          const last = items[items.length - 1];
          for (const item of items) {
            const lastSync = item.lastSync;
            await this.sync(item, force, log);
            if (item !== last && item.lastSync !== lastSync) {
              await SyncHelper.delay(delay);
            }
          }
          resolve();
        });
      });
    }).then(() => {
      syncAlertDismiss();
      this.log(true, 'Finished', AlertType.success);
    });
  }

}
