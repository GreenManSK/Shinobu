import {Savable} from '../types/savable';

/**
 * Used for saving entities to chrome storage
 */
export interface IChromeService {
  /**
   * Get all entities
   */
  getAll(): Promise<Savable[]>;

  /**
   * Get entity by id
   */
  get(id: number): Promise<Savable>;

  /**
   * Add new entity to storage and generated its id, or replace the old one
   */
  save(item: Savable): Promise<void>;

  /**
   * Deletes entity from storage based on the id
   */
  delete(item: Savable): Promise<void>;
}
