import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppUpdateService } from './services/app-update.service';
import { TabService } from './services/data/shinobu/tab.service';
import { NoteService } from './services/data/shinobu/note.service';
import { AnimeService } from './services/data/kirino/anime.service';
import { SongService } from './services/data/kirino/song.service';
import { OvaService } from './services/data/kirino/ova.service';
import { ShowService } from './services/data/kirino/show.service';
import { MangaService } from './services/data/kirino/manga.service';

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
    private mangaService: MangaService
  ) {
  }

  ngOnInit(): void {
    // To preventively sync data
    this.animeService.getAll().subscribe(() => {});
    this.songService.getAll().subscribe(() => {});
    this.ovaService.getAll().subscribe(() => {});
    this.showService.getAll().subscribe(() => {});
    this.mangaService.getAll().subscribe(() => {});
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
