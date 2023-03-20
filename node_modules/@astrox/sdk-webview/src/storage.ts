import { AbstractedClientStorage } from '@astrox/sdk-core';

export class ICStorage implements AbstractedClientStorage {
  constructor(public readonly prefix = 'astrox-', private readonly _localStorage?: Storage) {}

  public get(key: string): Promise<string | null> {
    return Promise.resolve(this._getICStorage().getItem(this.prefix + key));
  }

  public set(key: string, value: string): Promise<void> {
    this._getICStorage().setItem(this.prefix + key, value);
    return Promise.resolve();
  }

  public remove(key: string): Promise<void> {
    this._getICStorage().removeItem(this.prefix + key);
    return Promise.resolve();
  }

  private _getICStorage() {
    if (this._localStorage) {
      return this._localStorage;
    }

    const ls =
      typeof window === 'undefined'
        ? typeof global === 'undefined'
          ? typeof self === 'undefined'
            ? undefined
            : self.localStorage
          : global.localStorage
        : window.localStorage;

    if (!ls) {
      throw new Error('Could not find local storage.');
    }

    return ls;
  }
}
