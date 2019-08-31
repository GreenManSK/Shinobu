import StorageArea = chrome.storage.StorageArea;

export class ChromeMockStorageService implements StorageArea {

  private items: any = {};

  constructor() {
  }

  clear( callback?: () => void ): void {
    this.items = {};
  }

  get( callback: ( items: { [p: string]: any } ) => void ): void;
  get( keys: string | string[] | object | null, callback: ( items: { [p: string]: any } ) => void ): void;
  get( keys: (( items: { [p: string]: any } ) => void) | string | string[] | object | null, callback?: ( items: { [p: string]: any } ) => void ): void {
    if (typeof keys === 'string') {
      const result = {};
      result[keys] = this.items[keys];
      callback(result);
    } else {
      const result = {};
      for (const key of (keys as string[])) {
        result[key] = this.items[key];
      }
      callback(result);
    }
  }

  getBytesInUse( callback: ( bytesInUse: number ) => void ): void;
  getBytesInUse( keys: string | string[] | null, callback: ( bytesInUse: number ) => void ): void;
  getBytesInUse( keys: (( bytesInUse: number ) => void) | string | string[] | null, callback?: ( bytesInUse: number ) => void ): void {
    callback(0);
  }

  remove( keys: string | string[], callback?: () => void ): void {
    if (keys instanceof Array) {
      keys.forEach(( k ) => delete this.items[k]);
    } else {
      delete this.items[keys];
    }
    callback();
  }

  set( items: object, callback?: () => void ): void {
    this.items = {...this.items, ...items};
    callback();
  }


}
