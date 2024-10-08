import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ErrorService } from '../../../services/error.service';
import { DynamicStorageService } from '../../../services/data/dynamic-storage.service';
import { TabService } from '../../../services/data/shinobu/tab.service';
import { NoteService } from '../../../services/data/shinobu/note.service';
import { Subscription } from 'rxjs';
import { AlertService } from '../../../services/alert.service';
import { Alert } from '../../../types/Alert';
import { AlertType } from '../../../types/AlertType';
import { AnimeService } from '../../../services/data/kirino/anime.service';
import { KirinoSettingsService } from '../../../services/data/kirino/kirino-settings.service';
import { MangaService } from '../../../services/data/kirino/manga.service';
import { OvaService } from '../../../services/data/kirino/ova.service';
import { ShowService } from '../../../services/data/kirino/show.service';
import { SongService } from '../../../services/data/kirino/song.service';

@Component({
  selector: 'firebase-migration',
  templateUrl: './firebase-migration.component.html',
  styleUrls: ['./firebase-migration.component.scss']
})
export class FirebaseMigrationComponent implements OnInit, OnDestroy {

  public static readonly DATA_SERVICES = [TabService, NoteService, AnimeService, MangaService, OvaService, ShowService, SongService];

  public isAuthenticated = false;
  public hasDataToMigrate = false;

  private authUnsubscribe?: () => void;
  private dataServices: {
    local: DynamicStorageService<any>,
    firebase: DynamicStorageService<any>
  }[] = [];

  constructor( public authService: AuthService, afs: AngularFirestore, errorService: ErrorService, private alertService: AlertService ) {
    authService.isAuthenticatedPromise().then(isAuthenticated => this.isAuthenticated = isAuthenticated);
    FirebaseMigrationComponent.DATA_SERVICES.forEach(service => {
      const firebase = new service(afs, authService, errorService);
      const local = new service(afs, authService, errorService);
      local.useLocalStorage();
      this.dataServices.push({local, firebase});
    })
  }

  ngOnInit(): void {
    this.authUnsubscribe = this.authService.subscribe((isAuthenticated => this.isAuthenticated = isAuthenticated));
    this.checkIfCanMigrate();
  }

  ngOnDestroy(): void {
    this.authUnsubscribe && this.authUnsubscribe();
  }

  public migrateData( event: any ) {
    if (event) {
      event.preventDefault();
    }
    if (confirm('Do you really want to migrate your old data?')) {
      this.migrateOldData().then(() => this.deleteOldData()).then(() => {
        this.alertService.publish(new Alert('Migration', 'Migrated old data!', AlertType.success));
        this.hasDataToMigrate = false;
      });
    }
  }

  public deleteData( event: any ) {
    if (event) {
      event.preventDefault();
    }
    if (confirm('Do you really want to delete your old data?')) {
      this.deleteOldData().then(() => {
        this.alertService.publish(new Alert('Migration', 'Data deleted!', AlertType.warning));
        this.hasDataToMigrate = false;
      });
    }
  }

  private checkIfCanMigrate() {
    this.dataServices.forEach(( {local} ) => {
      local.onReady().then(() => {
        let subscription: Subscription | undefined = undefined;
        subscription = local.getAll().subscribe(data => {
          if (data.length > 0) {
            this.hasDataToMigrate = true;
          }
          subscription?.unsubscribe();
        })
      });
    });
  }

  private migrateOldData() {
    return new Promise<void>(( resolve ) => {
      let needToProcess = this.dataServices.length;
      this.dataServices.forEach(( {local, firebase} ) => {
        local.onReady().then(() => {
          let subscription: Subscription | undefined = undefined;
          subscription = local.getAll().subscribe(data => {
            data.forEach(item => {
              delete item.id;
              firebase.save(item);
            });
            subscription?.unsubscribe();
            needToProcess--;
            if (needToProcess <= 0) {
              resolve();
            }
          })
        });
      });
    });
  }

  private deleteOldData() {
    return new Promise<void>(( resolve ) => {
      let needToProcess = this.dataServices.length;
      this.dataServices.forEach(( {local} ) => {
        local.onReady().then(() => {
          let subscription: Subscription | undefined = undefined;
          subscription = local.getAll().subscribe(data => {
            data.forEach(item => local.delete(item));
            subscription?.unsubscribe();
            needToProcess--;
            if (needToProcess <= 0) {
              resolve();
            }
          })
        });
      });
    });
  }
}
