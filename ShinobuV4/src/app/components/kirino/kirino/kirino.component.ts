import { Component, OnInit } from '@angular/core';
import { KirinoSyncService } from '../../../services/sync/kirino/kirino-sync.service';

@Component({
  selector: 'app-kirino',
  templateUrl: './kirino.component.html',
  styleUrls: ['./kirino.component.scss']
})
export class KirinoComponent implements OnInit {

  constructor( private kirinoSyncService: KirinoSyncService ) {
  }

  ngOnInit(): void {
    this.kirinoSyncService.run();
  }

}
