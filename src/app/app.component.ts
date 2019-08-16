import { Component } from '@angular/core';
import { Anime } from './kirino/types/anime';
import { AnimeService } from "./kirino/services/anime.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'shinobu';

  constructor() {
    const animeService = new AnimeService(chrome.storage.local);
    console.log(animeService);
    animeService.save(new Anime('Anime1', 513))
      .then(() => animeService.save(new Anime('Anime2', 513)))
      .then(() => animeService.save(new Anime('Anime3', 513)))
      .then(() => animeService.getAll())
      .then((items) => console.log(items));
  }
}
