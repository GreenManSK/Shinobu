import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[longPressContextMenu]'
})
export class LongPressContextMenuDirective {

  @HostListener('press', ['$event'])
  public triggerContextMenu($event: any) {
    if ($event) {
      $event.preventDefault();
    }

    const element = $event.target;
    const ev3 = new MouseEvent("contextmenu", {
      bubbles: true,
      cancelable: false,
      view: window,
      button: 2,
      buttons: 0,
      clientX: element.getBoundingClientRect().x,
      clientY: element.getBoundingClientRect().y
    });
    element.dispatchEvent(ev3);

    return false;
  }
}
