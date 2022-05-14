export class BoxButton {
  constructor(
    public title: string = '',
    public icon: string = '',
    public callback?: ( data: any ) => void,
    public disabled = false
  ) {
  }
}
