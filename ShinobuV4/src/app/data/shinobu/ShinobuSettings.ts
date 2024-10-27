import { ChristmasThemeType, ThemeType } from 'src/app/types/shinobu/ThemeType';
import { ASavable } from '../ASavable';

export class ShinobuSettings extends ASavable {
  constructor(
    public theme: string = ThemeType.Shinobu,
    public christmasTheme: string = ChristmasThemeType.Shinobu
  ) {
    super();
  }
}
