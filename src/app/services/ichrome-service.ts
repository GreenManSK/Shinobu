import {Savable} from '../types/savable';

/**
 * Used for saving entities to chrome storage
 */
export interface IChromeService {
  /**
   * Get all entities
   */
  getAll(callback: (result: Savable[]) => void): void;

  /**
   * Get entity by id
   */
  get(id: number, callback: (result: Savable) => void): void;

  /**
   * Add new entity to storage and generated its id, or replace the old one
   */
  save(item: Savable, callback: (success: boolean) => void): void;

  /**
   * Deletes entity from storage based on the id
   */
  delete(item: Savable, callback: (success: boolean) => void): void;
}
