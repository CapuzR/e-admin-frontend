import * as Cbor from "./cbor";
import { fromHexString, toHexString } from "./util";
export function encodeRequest(rpc) {
    return toHexString(Cbor.encode(rpc));
}
export function decodeResponse(buf) {
    var decoded = Cbor.decode(fromHexString(buf));
    if (decoded.error) {
        throw new Error(JSON.stringify(decoded.error));
    }
    return decoded.result;
}
export function rpcBuilder(method) {
    for(var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        params[_key - 1] = arguments[_key];
    }
    return {
        jsonrpc: "2.0",
        method: method,
        params: params,
        id: 0
    };
}
export function hasOwnProperty(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}
