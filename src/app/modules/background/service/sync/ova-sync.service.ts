import { Injectable } from '@angular/core';
import { OvaService } from '../../../kirino/services/ova.service';
import { AnidbEpisodeParserService } from '../../../../services/parsers/anidb-episode-parser.service';
import { Ova } from '../../../kirino/types/ova';

@Injectable({
  providedIn: 'root'
})
export class OvaSyncService {

  constructor( private ovaService: OvaService, private ovaParser: AnidbEpisodeParserService ) {

  }

  public sync( id: number ): Promise<Ova> {
    return this.ovaService.get(id).then(( ova: Ova ) => {
      if (!ova || !ova.anidbId) {
        return ova;
      }
      const url = AnidbEpisodeParserService.getUrl(ova.anidbId);
      return this.ovaParser.getData(url).then(( updatedData: Ova ) => {
        if (updatedData && updatedData.airdate) {
          ova.airdate = updatedData.airdate;
          console.log(ova);
          return this.ovaService.save(ova).then(() => ova);
        }
      });
    });
  }
}
