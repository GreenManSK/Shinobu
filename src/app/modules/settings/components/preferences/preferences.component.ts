import { Component, OnInit } from '@angular/core';
import { BoxColor } from '../../../kirino/components/box/box-color.enum';
import { PreferenceService } from '../../services/preference.service';
import { Preference } from '../../types/preference';

@Component({
  selector: 'preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {

  public readonly color = BoxColor.Orange;

  public preference: Preference;

  constructor( private preferenceService: PreferenceService ) {
  }

  ngOnInit() {
    this.preferenceService.get().then(( result ) => this.preference = result);
  }

  public save(): void {
    this.preferenceService.set(this.preference);
  }
}
