export class SyncHelper {
  private constructor() {

  }

  public static delay( ms: number ): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
