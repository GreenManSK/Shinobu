import { Component, OnInit } from '@angular/core';
import { Color } from '../../../types/Color';

@Component({
  selector: 'shinobu-preference',
  templateUrl: './shinobu-preference.component.html',
  styleUrls: ['./shinobu-preference.component.scss']
})
export class ShinobuPreferenceComponent implements OnInit {

  public readonly color = Color.Blue;

  constructor() {
  }

  ngOnInit(): void {
  }
}
