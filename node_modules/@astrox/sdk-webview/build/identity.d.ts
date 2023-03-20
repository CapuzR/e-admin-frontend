import { HttpAgentRequest, PublicKey, Signature, SignIdentity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { DelegationChain } from '@dfinity/identity';
export declare class AstroXIdentity extends SignIdentity {
    #private;
    private _cacheKey;
    private _chain;
    constructor(_cacheKey: string, _chain: DelegationChain);
    getPublicKey(): PublicKey;
    getPrincipal(): Principal;
    sign(blob: ArrayBuffer): Promise<Signature>;
    transformRequest(request: HttpAgentRequest): Promise<unknown>;
}
//# sourceMappingURL=identity.d.ts.map