import { Component, OnInit } from '@angular/core';
import { AnidbSongParserService } from '../../service/parsers/anidb-song-parser.service';

@Component({
  selector: 'app-browser-action',
  templateUrl: './browser-action.component.html',
  styleUrls: ['./browser-action.component.scss']
})
export class BrowserActionComponent implements OnInit {

  constructor(
    private anidbSongParser: AnidbSongParserService
  ) {

    anidbSongParser.getData('http://anidb.net/song/102177').then(console.log);
  }

  ngOnInit() {
  }

}
