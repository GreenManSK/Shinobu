export interface ISiteParser<T> {
  match( url: string ): boolean;

  getData( url: string ): Promise<T>;

  getFormUrl( data: T ): string;
}
