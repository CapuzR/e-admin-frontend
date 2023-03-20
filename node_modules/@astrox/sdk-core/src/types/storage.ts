/**
 * Interface for persisting user authentication data
 */
export interface AbstractedClientStorage {
  get(key: string): Promise<string | null>;

  set(key: string, value: string): Promise<void>;

  remove(key: string): Promise<void>;
}
