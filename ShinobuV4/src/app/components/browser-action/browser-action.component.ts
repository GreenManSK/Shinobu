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
import { ActivatedRoute } from '@angular/router';

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
    private route: ActivatedRoute,
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
    const url = this.route.snapshot.queryParams['url'];
    if (url) {
      for (const parser of this.parsers) {
        if (parser.match(url)) {
          parser.getData(url).then(( data ) => {
            window.open(parser.getFormUrl(data),"_self");
            // this.popUpService.openPopUp(
            //   parser.getFormUrl(data),
            //   '',
            //   BrowserActionComponent.WIDTH,
            //   BrowserActionComponent.HEIGHT
            // );
          });
          break;
        }
      }
    }
  }

}
