import { Injectable } from '@angular/core';
import { DynamicStorageService } from '../dynamic-storage.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../../auth.service';
import { ErrorService } from '../../error.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { ShinobuSettings } from 'src/app/data/shinobu/ShinobuSettings';

@Injectable({
  providedIn: 'root',
})
export class ShinobuSettingsService extends DynamicStorageService<ShinobuSettings> {
  private subject?: BehaviorSubject<ShinobuSettings>;
  private settings: ShinobuSettings = new ShinobuSettings();

  constructor(
    afs: AngularFirestore,
    authService: AuthService,
    errorService: ErrorService
  ) {
    super('shinobuSettings', afs, authService, errorService);
    this.readyPromise = this.readyPromise.then(() => {
      return new Promise<void>((resolve) => {
        super.getAll().subscribe((allSettings) => {
          if (allSettings.length > 0) {
            this.settings = allSettings[0];
            this.subject?.next(this.settings);
          }
          resolve();
        });
      });
    });
  }

  override getById(id: string): Observable<ShinobuSettings> {
    throw new Error('Unsupported method');
  }

  override getAll(): Observable<ShinobuSettings[]> {
    throw new Error('Unsupported method');
  }

  override save(item: ShinobuSettings): Promise<ShinobuSettings> {
    throw new Error('Unsupported method');
  }

  override delete(item: ShinobuSettings): Promise<void> {
    throw new Error('Unsupported method');
  }

  public get(): ShinobuSettings {
    return this.settings;
  }

  public update(settings: ShinobuSettings) {
    if (this.settings.id) {
      settings.id = this.settings.id;
    }
    return super.save(settings).then((newSettings) => {
      this.settings = newSettings;
      this.subject?.next(this.settings);
    });
  }

  public asObservable(): Observable<ShinobuSettings> {
    if (!this.subject) {
      this.subject = new BehaviorSubject<ShinobuSettings>(this.settings);
    }
    return this.subject.asObservable();
  }
}
