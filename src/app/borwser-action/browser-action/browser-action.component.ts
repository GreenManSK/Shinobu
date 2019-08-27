import { Component, OnInit } from '@angular/core';
import { AnidbSongParserService } from '../../services/parsers/anidb-song-parser.service';
import { SiteParser } from '../../services/parsers/site-parser';
import { PopUpService } from '../../services/pop-up.service';
import { AnisonParserService } from '../../services/parsers/anison-parser.service';
import { TheTVDBParserService } from '../../services/parsers/the-tvdbparser.service';
import {AnidbEpisodeParserService} from '../../services/parsers/anidb-episode-parser.service';

@Component({
  selector: 'app-browser-action',
  templateUrl: './browser-action.component.html',
  styleUrls: ['./browser-action.component.scss']
})
export class BrowserActionComponent implements OnInit {

  public static readonly WIDTH = 600;
  public static readonly HEIGHT = 500;

  private parsers: SiteParser[];

  constructor(
    public popUpService: PopUpService,
    anidbSongParser: AnidbSongParserService,
    anisonParser: AnisonParserService,
    theTVDBParser: TheTVDBParserService,
    anidbEpisodeParser: AnidbEpisodeParserService,
  ) {
    this.parsers = [
      anidbSongParser,
      anisonParser,
      theTVDBParser,
      anidbEpisodeParser
    ];
  }

  ngOnInit() {
    chrome.tabs.query({currentWindow: true, active: true}, ( tabs ) => {
      const url = tabs[0].url;
      for (const parser of this.parsers) {
        if (parser.match(url)) {
          parser.getData(url).then(( data ) => {
            this.popUpService.openPopUp(
              parser.getFormUrl(data),
              '',
              BrowserActionComponent.WIDTH,
              BrowserActionComponent.HEIGHT
            );
          });
          break;
        }
      }
    });
  }

}
