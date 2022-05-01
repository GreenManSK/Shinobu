export class LogError {
  constructor(
    public source: string,
    public text: string,
    public exception: Error | undefined = undefined,
    public timestamp: number = Date.now(),
  ) {
  }

}
