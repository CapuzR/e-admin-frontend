import { AbstractedClientStorage } from '@astrox/sdk-core';
export declare class ICStorage implements AbstractedClientStorage {
    readonly prefix: string;
    private readonly _localStorage?;
    constructor(prefix?: string, _localStorage?: Storage);
    get(key: string): Promise<string | null>;
    set(key: string, value: string): Promise<void>;
    remove(key: string): Promise<void>;
    private _getICStorage;
}
//# sourceMappingURL=storage.d.ts.map