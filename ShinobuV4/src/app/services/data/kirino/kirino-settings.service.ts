import { Injectable } from '@angular/core';
import { DynamicStorageService } from '../dynamic-storage.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../../auth.service';
import { ErrorService } from '../../error.service';
import { KirinoSettings } from '../../../data/kirino/KirinoSettings';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KirinoSettingsService extends DynamicStorageService<KirinoSettings> {

  private subject?: BehaviorSubject<KirinoSettings>;
  private settings: KirinoSettings = new KirinoSettings();

  constructor( afs: AngularFirestore, authService: AuthService, errorService: ErrorService ) {
    super('kirinoSettings', afs, authService, errorService);
    this.readyPromise = this.readyPromise.then(() => {
      super.getAll().subscribe(allSettings => {
        if (allSettings.length > 0) {
          this.settings = allSettings[0];
          this.subject?.next(this.settings);
        }
      });
    });
  }

  override getById( id: string ): Observable<KirinoSettings> {
    throw new Error('Unsupported method');
  }

  override getAll(): Observable<KirinoSettings[]> {
    throw new Error('Unsupported method');
  }

  override save( item: KirinoSettings ): Promise<KirinoSettings> {
    throw new Error('Unsupported method');
  }

  override delete( item: KirinoSettings ): Promise<void> {
    throw new Error('Unsupported method');
  }

  public get(): KirinoSettings {
    return this.settings;
  }

  public update( settings: KirinoSettings ) {
    settings.id = this.settings.id;
    super.save(settings).then(( newSettings ) => {
      this.settings = newSettings;
      this.subject?.next(this.settings);
    });
  }

  public subscribe(): Observable<KirinoSettings> {
    if (!this.subject) {
      this.subject = new BehaviorSubject<KirinoSettings>(this.settings);
    }
    return this.subject.asObservable();
  }

}
