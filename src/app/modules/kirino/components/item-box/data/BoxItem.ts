import { BoxLink } from './BoxLink';
import { BoxButton } from './BoxButton';

export class BoxItem {
  constructor(
    public title: string,
    public text: string,
    public date: Date,
    public groupKey: any = null,
    public data: any = null,
    public badges: BoxLink[] = [],
    public buttons: BoxButton[] = [],
    public link: BoxLink = null
  ) {

  }

}
