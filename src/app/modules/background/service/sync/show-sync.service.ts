import { Injectable } from '@angular/core';
import { ShowService } from '../../../kirino/services/show.service';
import { TheTVDBParserService } from '../../../../services/parsers/the-tvdbparser.service';
import { Show } from '../../../kirino/types/show';
import { EpisodeSyncHelper } from './episode-sync-helper';

@Injectable({
  providedIn: 'root'
})
export class ShowSyncService {

  constructor(
    private showService: ShowService,
    private showParser: TheTVDBParserService
  ) {
  }

  public sync( id: number ): Promise<Show> {
    return this.showService.get(id).then((show: Show) => {
      if (!show || !show.tvdbId) {
        return show;
      }
      const url = TheTVDBParserService.getUrl(show.tvdbId);
      return this.showParser.getData(url).then((updatedData: Show) => {
        if (updatedData) {
          EpisodeSyncHelper.updateEpisodes(show, updatedData.episodes);
          return this.showService.save(show).then(() => show);
        }
        return show;
      });
    });
  }
}
