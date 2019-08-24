import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopUpService {

  constructor() {
  }

  public openPopUp( url: string, title: string, width: number, height: number ): void {
    const dualScreenLeft = typeof window.screenLeft !== 'undefined' ? window.screenLeft : screen.availWidth;
    const dualScreenTop = typeof window.screenTop !== 'undefined' ? window.screenTop : screen.availHeight;

    const screenWidth = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth
      ? document.documentElement.clientWidth : screen.width;
    const screenHeight = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight
      ? document.documentElement.clientHeight : screen.height;

    const left = ((screenWidth / 2) - (width / 2)) + dualScreenLeft;
    const top = ((screenHeight / 2) - (height / 2)) + dualScreenTop;

    const newWindow = window.open(url, title, 'height=' + width + ',width=' + height + ', top=' + top + ', left=' + left);
    if (window.focus) {
      newWindow.focus();
    }
  }
}
