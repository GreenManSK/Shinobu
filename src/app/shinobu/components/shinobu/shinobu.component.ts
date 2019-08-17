import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shinobu',
  templateUrl: './shinobu.component.html',
  styleUrls: ['./shinobu.component.scss']
})
export class ShinobuComponent implements OnInit {

  public isChristmasTime: boolean;

  constructor() {
    this.checkChristmasTime();
  }

  ngOnInit() {
  }

  public checkChristmasTime(): void {
    const today = new Date();
    this.isChristmasTime = today.getMonth() === 11 || (today.getMonth() === 0 && today.getDay() < 10);
  }
}
