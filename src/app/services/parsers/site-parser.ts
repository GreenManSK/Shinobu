export interface SiteParser {
  match( url: string ): boolean;

  getData( url: string ): Promise<any>;

  getFormUrl( data: any ): string;
}
