import { ASavable } from '../ASavable';
import { Color } from '../../types/Color';

export class Note extends ASavable {
  constructor(
    public title: string = '',
    public text: string = '',
    public color: Color = Color.Pink
  ) {
    super();
  }
}
