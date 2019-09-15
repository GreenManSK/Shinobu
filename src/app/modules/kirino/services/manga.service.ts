import { Injectable } from '@angular/core';
import { AChromeService } from '../../../services/achrome.service';
import { ChromeStorageProviderService } from '../../../services/chrome-storage-provider.service';
import { ErrorService } from '../../../services/error.service';

@Injectable({
  providedIn: 'root'
})
export class MangaService extends AChromeService {

  constructor(
    chromeStorageProvider: ChromeStorageProviderService,
    protected errorService: ErrorService
  ) {
    super(chromeStorageProvider.getSync(), errorService);
  }

  protected getTypeName(): string {
    return 'Manga';
  }
}
