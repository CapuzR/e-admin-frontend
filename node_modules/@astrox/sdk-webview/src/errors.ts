import { BaseBridgeErrorResponse } from './types';

export class BridgeErrors {
  static bridgeUnknownError = 50000;
  static bridgeIllegalArguments = 50001;
  static bridgeIllegalState = 50002;
  static bridgeUnsupportedError = 50003;
  static bridgeIdentityNotFound = 50004;
  static bridgeIdentityExpired = 50005;
  static bridgeWalletNotFound = 50006;
  static bridgeOperationCancelled = 50007;
  static bridgeNFTIdentifierError = 50008;
  static bridgeUnknownMethod = 50009;
  static defaultErrorKind = 'JS-SDK-Error';
  static defaultErrorMessage = 'No More Detail';

  static fromErrorCode(
    code: number,
    kind: string = BridgeErrors.defaultErrorKind,
    message: string = BridgeErrors.defaultErrorMessage,
  ): BaseBridgeErrorResponse {
    const defaultReturn = {
      kind,
      text: 'Unknown Error',
    };
    switch (code) {
      case BridgeErrors.bridgeUnknownError:
        return { kind, text: `Unknown Error: ${message}` };
      case BridgeErrors.bridgeIllegalArguments:
        return { kind, text: `Illegal Arguments: ${message}` };
      case BridgeErrors.bridgeIllegalState:
        return { kind, text: `Illegal State: ${message}` };
      case BridgeErrors.bridgeUnsupportedError:
        return { kind, text: `Unsupported Error: ${message}` };
      case BridgeErrors.bridgeIdentityNotFound:
        return { kind, text: `Identity Not Found: ${message}` };
      case BridgeErrors.bridgeIdentityExpired:
        return { kind, text: `Identity Expired: ${message}` };
      case BridgeErrors.bridgeWalletNotFound:
        return { kind, text: `Wallet Not Found: ${message}` };
      case BridgeErrors.bridgeOperationCancelled:
        return { kind, text: `Operation Cancelled: ${message}` };
      case BridgeErrors.bridgeNFTIdentifierError:
        return { kind, text: `NFT Identifier Error: ${message}` };
      case BridgeErrors.bridgeUnknownMethod:
        return { kind, text: `Unknown method: ${message}` };
      default:
        return defaultReturn;
    }
  }
}
