import { Component, OnInit } from '@angular/core';
import { AnidbSongParserService } from '../../service/parsers/anidb-song-parser.service';
import { SiteParser } from '../../service/parsers/site-parser';
import { PopUpService } from '../../services/pop-up.service';

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
    anidbSongParser: AnidbSongParserService
  ) {
    this.parsers = [
      anidbSongParser
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
