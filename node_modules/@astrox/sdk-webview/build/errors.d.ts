import { BaseBridgeErrorResponse } from './types';
export declare class BridgeErrors {
    static bridgeUnknownError: number;
    static bridgeIllegalArguments: number;
    static bridgeIllegalState: number;
    static bridgeUnsupportedError: number;
    static bridgeIdentityNotFound: number;
    static bridgeIdentityExpired: number;
    static bridgeWalletNotFound: number;
    static bridgeOperationCancelled: number;
    static bridgeNFTIdentifierError: number;
    static bridgeUnknownMethod: number;
    static defaultErrorKind: string;
    static defaultErrorMessage: string;
    static fromErrorCode(code: number, kind?: string, message?: string): BaseBridgeErrorResponse;
}
//# sourceMappingURL=errors.d.ts.map