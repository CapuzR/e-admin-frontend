export interface RPCRequest {
  id?: number | null;
  jsonrpc: '2.0';
  method: string;
  params: any[];
}

export type RPCResponse<T> = RPCResult<T> | RPCError;

export interface RPCResult<T> {
  id?: number | null;
  jsonrpc: '2.0';
  method: string;
  result: T | undefined;
}

export interface RPCError {
  id?: number | null;
  jsonrpc: '2.0';
  method: string;
  error: {
    code: number;
    message: string;
  };
}
