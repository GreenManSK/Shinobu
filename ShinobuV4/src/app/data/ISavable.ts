export interface ISavable {
  id?: string;
  userId?: string;

  toPlainObject(): object;
}
