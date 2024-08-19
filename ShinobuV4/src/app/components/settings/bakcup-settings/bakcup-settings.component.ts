import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Color } from 'src/app/types/Color';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ErrorService } from '../../../services/error.service';
import { FirebaseMigrationComponent } from '../firebase-migration/firebase-migration.component';
import { DynamicStorageService } from 'src/app/services/data/dynamic-storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'bakcup-settings',
  templateUrl: './bakcup-settings.component.html',
  styleUrls: ['./bakcup-settings.component.scss'],
})
export class BakcupSettingsComponent implements OnInit {
  public readonly color = Color.Purple;

  public backupData = '{}';

  constructor(
    private authService: AuthService,
    private afs: AngularFirestore,
    private errorService: ErrorService
  ) {}

  ngOnInit(): void {}

  public exportData($event: any) {
    if ($event) {
      $event.preventDefault();
    }
    this.authService.isAuthenticatedPromise().then((isAuthenticated) => {
      const data = {} as any;
      const promises = FirebaseMigrationComponent.DATA_SERVICES.map(
        (service) => {
          const dataService = new service(
            this.afs,
            this.authService,
            this.errorService
          ) as DynamicStorageService<any>;
          if (!isAuthenticated) {
            dataService.useLocalStorage();
          }
          return new Promise((resolve) => {
            dataService.getAll().subscribe((items) => {
              data[dataService.collectionName] = items;
              resolve(true);
            });
          });
        }
      );
      Promise.all(promises).then(() => {
        this.backupData = JSON.stringify(data, null, 2);
      });
    });
  }

  public importData($event: any) {
    if ($event) {
      $event.preventDefault();
    }

    if (confirm('Do you really want to import new data?')) {
      const parsedData = JSON.parse(this.backupData);
      this.authService.isAuthenticatedPromise().then((isAuthenticated) => {
        const services = FirebaseMigrationComponent.DATA_SERVICES.map(
          (service) => {
            const dataService = new service(
              this.afs,
              this.authService,
              this.errorService
            ) as DynamicStorageService<any>;
            if (!isAuthenticated) {
              dataService.useLocalStorage();
            }
            return dataService;
          }
        );
        const deletePromises = services.map((service) => {
          return new Promise((resolve) => {
            let subscription: Subscription | undefined = undefined;
            subscription = service.getAll().subscribe((data) => {
              data.forEach((item) => service.delete(item));
              subscription?.unsubscribe();
              resolve(true);
            });
          });
        });
        Promise.all(deletePromises).then(() => {
          const savePromises = services.map((dataService) => {
            return new Promise((resolve) => {
              parsedData[dataService.collectionName]?.forEach((item: any) => {
                delete item.id;
                dataService.save(item);
              });
              resolve(true);
            });
          });
          Promise.all(savePromises).then(() => {
            alert('Data imported!');
          });
        });
      });
    }
  }
}
