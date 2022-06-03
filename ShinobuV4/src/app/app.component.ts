import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppUpdateService } from './services/app-update.service';
import { AnimeService } from './services/data/kirino/anime.service';
import { SongService } from './services/data/kirino/song.service';
import { OvaService } from './services/data/kirino/ova.service';
import { ShowService } from './services/data/kirino/show.service';
import { MangaService } from './services/data/kirino/manga.service';
import { KirinoSettingsService } from './services/data/kirino/kirino-settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit  {

  constructor(
    private router: Router,
    appUpdateService: AppUpdateService,
    private animeService: AnimeService,
    private songService: SongService,
    private ovaService: OvaService,
    private showService: ShowService,
    private mangaService: MangaService,
    private kirinoSettingsService: KirinoSettingsService
  ) {
  }

  ngOnInit(): void {
    // To preventively sync data
    this.animeService.onReady().then(() => this.animeService.getAll().subscribe(() => {}));
    this.songService.onReady().then(() => this.songService.getAll().subscribe(() => {}));
    this.ovaService.onReady().then(() => this.ovaService.getAll().subscribe(() => {}));
    this.showService.onReady().then(() => this.showService.getAll().subscribe(() => {}));
    this.mangaService.onReady().then(() => this.mangaService.getAll().subscribe(() => {}));
  }

  public isBackground(): boolean {
    return this.router.url.startsWith('/background');
  }

  public showMenu(): boolean {
    return !this.router.url.startsWith('/kirino-form') && !this.router.url.startsWith('/browser-action');
  }

  public isKirino(): boolean {
    return this.router.url.startsWith('/kirino');
  }
}
