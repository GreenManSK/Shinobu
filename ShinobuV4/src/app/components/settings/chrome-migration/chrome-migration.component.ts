import { Component, OnInit } from '@angular/core';
import { MigrationService } from '../../../services/chrome/migration.service';
import { AlertService } from '../../../services/alert.service';
import { AlertType } from '../../../types/AlertType';
import { Alert } from '../../../types/Alert';

@Component({
  selector: 'chrome-migration',
  templateUrl: './chrome-migration.component.html',
  styleUrls: ['./chrome-migration.component.scss']
})
export class ChromeMigrationComponent implements OnInit {

  public hasDataToMigrate = false;

  constructor( private migrationService: MigrationService, private alertService: AlertService ) {
  }

  ngOnInit(): void {
    this.migrationService.hasDataToMigrate().then(result => this.hasDataToMigrate = result);
  }

  public migrateData( $event: MouseEvent ) {
    $event.preventDefault();
    if (confirm('Start data migration?')) {
      this.migrationService.migrate().then(() => {
        this.migrationService.markAsMigrated();
        this.alertService.publish(new Alert('Migration', 'Migration completed!', AlertType.success));
      });
    }
  }

  public skipMigration( $event: MouseEvent ) {
    $event.preventDefault();
    if (confirm('Do you really want to skip migration?')) {
      this.migrationService.markAsMigrated();
    }
  }
}
