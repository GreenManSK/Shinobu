import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ErrorService } from '../../../services/error.service';
import { DynamicStorageService } from '../../../services/data/dynamic-storage.service';
import { TabService } from '../../../services/data/shinobu/tab.service';
import { NoteService } from '../../../services/data/shinobu/note.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'firebase-migration',
  templateUrl: './firebase-migration.component.html',
  styleUrls: ['./firebase-migration.component.scss']
})
export class FirebaseMigrationComponent implements OnInit, OnDestroy {

  private static readonly DATA_SERVICES = [TabService, NoteService];

  public isAuthenticated = false;
  public hasDataToMigrate = false;

  private authUnsubscribe?: () => void;
  private dataServices: {
    local: DynamicStorageService<any>,
    firebase: DynamicStorageService<any>
  }[] = [];

  constructor( public authService: AuthService, afs: AngularFirestore, errorService: ErrorService ) {
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
        alert('Migrated old data!')
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
        alert('Data deleted!')
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
