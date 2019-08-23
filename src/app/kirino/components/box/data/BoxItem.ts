import {BoxLink} from './BoxLink';

export class BoxItem {
  constructor(
    public title: string,
    public text: string,
    public date: Date,
    public groupKey: any = null,
    public data: any = null,
    public icons: BoxLink[] = [],
    public buttons: BoxLink[] = [],
    public link: BoxLink = null
  ) {

  }

}
