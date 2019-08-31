export class LogError {
  constructor(
    public source: string,
    public text: string,
    public timestamp: number = Date.now(),
    public exception: Error = null
  ) {
  }

}
