/// <reference types="chrome" />
import { Component, OnInit } from '@angular/core';
import { ISiteParser } from '../../services/parsers/kirino/isite-parser';
import { PopUpService } from '../../services/pop-up.service';
import { AnidbSongParserService } from '../../services/parsers/kirino/anidb-song-parser.service';
import { AnisonParserService } from '../../services/parsers/kirino/anison-parser.service';
import { TheTVDBParserService } from '../../services/parsers/kirino/the-tvdbparser.service';
import { AnidbEpisodeParserService } from '../../services/parsers/kirino/anidb-episode-parser.service';
import { AnidbParserService } from '../../services/parsers/kirino/anidb-parser.service';
import { MangaParserService } from '../../services/parsers/kirino/manga-parser.service';

@Component({
  selector: 'app-browser-action',
  templateUrl: './browser-action.component.html',
  styleUrls: ['./browser-action.component.scss']
})
export class BrowserActionComponent implements OnInit {

  public static readonly WIDTH = 600;
  public static readonly HEIGHT = 500;

  private parsers: ISiteParser<any>[] = [];

  constructor(
    public popUpService: PopUpService,
    anidbSongParser: AnidbSongParserService,
    anisonParser: AnisonParserService,
    theTVDBParser: TheTVDBParserService,
    anidbEpisodeParser: AnidbEpisodeParserService,
    anidbParser: AnidbParserService,
    mangaParser: MangaParserService
  ) {
    this.parsers = [
      anidbSongParser,
      anisonParser,
      theTVDBParser,
      anidbEpisodeParser,
      anidbParser,
      mangaParser
    ];
  }

  ngOnInit(): void {
    chrome.tabs.query({currentWindow: true, active: true}, ( tabs ) => {
      const url = tabs[0].url;
      if (!url) {
        return;
      }
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
