import { ASavable } from '../ASavable';

export class KirinoSettings extends ASavable {
  constructor(
    public nyaaUrl: string = '',
    public automaticSync: boolean = false,
    public refreshRatesInMins: { [key: string]: number } = {}
  ) {
    super();
  }
}
