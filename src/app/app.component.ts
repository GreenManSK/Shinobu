import {Component} from '@angular/core';
import {Anime} from './kirino/types/anime';
import {Episode} from './kirino/types/episode';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'shinobu';

  constructor() {
    let test = new Episode("sfsaf asf ", Date.now());
    console.log(test);
    console.log(JSON.stringify(test));
  }
}
