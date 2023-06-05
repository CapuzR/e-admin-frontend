import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type AssetRequest = {
    'Put' : {
      'key' : string,
      'contentType' : string,
      'callback' : [] | [Callback],
      'payload' : { 'StagedData' : null } |
        { 'Payload' : Uint8Array | number[] },
    }
  } |
  { 'Remove' : { 'key' : string, 'callback' : [] | [Callback] } } |
  { 'StagedWrite' : WriteAsset };
export type AuthArgs = { 'Auth' : RequestArgs } |
  { 'Admin' : RequestArgs } |
  { 'GameServers' : RequestArgs } |
  { 'AllowedUsers' : RequestArgs };
export type Callback = ActorMethod<[], undefined>;
export interface Card {
  'url' : string,
  'thumbnail' : string,
  'collectionId' : string,
  'mimeType' : string,
  'stats' : Array<CardStats__1>,
  'index' : bigint,
  'collectionName' : string,
}
export interface CardArgs {
  'id' : string,
  'url' : string,
  'thumbnail' : string,
  'collectionId' : string,
  'mimeType' : string,
  'stats' : Array<CardStats>,
  'index' : bigint,
  'collectionName' : string,
}
export interface CardCollectionArgs {
  'filters' : Array<Filter>,
  'loreContext' : string,
  'collectionId' : string,
  'kind' : string,
  'name' : string,
  'description' : string,
  'batchUpdate' : boolean,
  'haveMultipleAC' : boolean,
  'standard' : string,
}
export type CardCollectionError = { 'CardCollectionAlreadyExists' : null } |
  { 'NotAuthorized' : null } |
  { 'Unknown' : string } |
  { 'NonExistentCardCollection' : null };
export interface CardCollectionSuccess {
  'filters' : Array<Filter>,
  'loreContext' : string,
  'collectionId' : string,
  'cards' : Array<CardSuccess>,
  'kind' : string,
  'name' : string,
  'description' : string,
  'haveMultipleAC' : boolean,
  'standard' : string,
}
export type CardError = { 'NotAuthorized' : null } |
  { 'Unknown' : string } |
  { 'CardAlreadyExists' : null } |
  { 'NonExistentCard' : null };
export type CardStats = { 'BountyRush' : Array<Property> } |
  { 'Traits' : Array<Property> } |
  { 'ElementumGeneral' : Array<Property> };
export type CardStats__1 = { 'BountyRush' : Array<Property__1> } |
  { 'Traits' : Array<Property__1> } |
  { 'ElementumGeneral' : Array<Property__1> };
export interface CardSuccess {
  'id' : string,
  'url' : string,
  'thumbnail' : string,
  'mimeType' : string,
  'stats' : Array<CardStats>,
  'index' : bigint,
  'collectionName' : string,
}
export interface Checkbox { 'options' : Array<string> }
export type Error = { 'NotAuthorized' : null } |
  { 'NonExistentRole' : null };
export type FieldType = { 'TextField' : string } |
  { 'Range' : Array<bigint> } |
  { 'Checkbox' : Checkbox };
export type Filter = { 'BountyRush' : Array<FilterDetails> } |
  { 'Traits' : Array<FilterDetails> } |
  { 'ElementumGeneral' : Array<FilterDetails> };
export interface FilterDetails { 'kind' : FieldType, 'name' : string }
export type HeaderField = [string, string];
export interface InitArgs {
  'allowedUsers' : [] | [Array<Principal>],
  'auth' : [] | [Array<Principal>],
  'admins' : [] | [Array<Principal>],
  'environment' : string,
  'gameServers' : [] | [Array<Principal>],
}
export interface Property { 'value' : Value, 'name' : string }
export interface Property__1 { 'value' : Value__1, 'name' : string }
export interface Request {
  'url' : string,
  'method' : string,
  'body' : Uint8Array | number[],
  'headers' : Array<HeaderField>,
}
export type RequestArgs = { 'Add' : Array<Principal> } |
  { 'IsIn' : Principal } |
  { 'Remove' : Principal } |
  { 'RemoveAll' : null } |
  { 'GetAll' : null } |
  { 'IsCallerIn' : null };
export interface Response {
  'body' : Uint8Array | number[],
  'headers' : Array<HeaderField>,
  'streaming_strategy' : [] | [StreamingStrategy],
  'status_code' : number,
}
export type Result = { 'ok' : null } |
  { 'err' : CardCollectionError };
export type Result_1 = { 'ok' : null } |
  { 'err' : UpdateCardError };
export type Result_2 = { 'ok' : [] | [Array<Principal>] } |
  { 'err' : Error };
export type Result_3 = { 'ok' : Array<CardCollectionSuccess> } |
  { 'err' : CardCollectionError };
export type Result_4 = { 'ok' : CardCollectionSuccess } |
  { 'err' : CardCollectionError };
export type Result_5 = { 'ok' : Card } |
  { 'err' : CardError };
export type Result_6 = { 'ok' : null } |
  { 'err' : CardError };
export type Result_7 = { 'ok' : null } |
  { 'err' : StaticError };
export type StaticError = { 'Immutable' : null } |
  { 'NotFound' : null } |
  { 'NotAuthorized' : null } |
  { 'Unauthorized' : null } |
  { 'AlreadyExists' : null } |
  { 'InvalidRequest' : null } |
  { 'AuthorizedPrincipalLimitReached' : bigint } |
  { 'FailedToWrite' : string };
export type StreamingCallback = ActorMethod<
  [StreamingCallbackToken],
  StreamingCallbackResponse
>;
export interface StreamingCallbackResponse {
  'token' : [] | [StreamingCallbackToken],
  'body' : Uint8Array | number[],
}
export interface StreamingCallbackToken {
  'key' : string,
  'index' : bigint,
  'content_encoding' : string,
}
export type StreamingStrategy = {
    'Callback' : {
      'token' : StreamingCallbackToken,
      'callback' : StreamingCallback,
    }
  };
export type UpdateCardError = { 'NotAuthorized' : null } |
  { 'Unknown' : string } |
  { 'NonExistentCard' : null };
export type Value = { 'Int' : bigint } |
  { 'Nat' : bigint } |
  { 'Nat16' : number } |
  { 'Nat32' : number } |
  { 'Nat64' : bigint } |
  { 'Blob' : Uint8Array | number[] } |
  { 'Bool' : boolean } |
  { 'Int8' : number } |
  { 'Nat8' : number } |
  { 'Text' : string } |
  { 'Bytes' : Uint8Array | number[] } |
  { 'Int16' : number } |
  { 'Int32' : number } |
  { 'Int64' : bigint } |
  { 'Option' : [] | [Value] } |
  { 'Float' : number } |
  { 'Principal' : Principal } |
  { 'Array' : Array<Value> } |
  { 'Class' : Array<Property> };
export type Value__1 = { 'Int' : bigint } |
  { 'Nat' : bigint } |
  { 'Nat16' : number } |
  { 'Nat32' : number } |
  { 'Nat64' : bigint } |
  { 'Blob' : Uint8Array | number[] } |
  { 'Bool' : boolean } |
  { 'Int8' : number } |
  { 'Nat8' : number } |
  { 'Text' : string } |
  { 'Bytes' : Uint8Array | number[] } |
  { 'Int16' : number } |
  { 'Int32' : number } |
  { 'Int64' : bigint } |
  { 'Option' : [] | [Value__1] } |
  { 'Float' : number } |
  { 'Principal' : Principal } |
  { 'Array' : Array<Value__1> } |
  { 'Class' : Array<Property__1> };
export type WriteAsset = {
    'Init' : { 'id' : string, 'size' : bigint, 'callback' : [] | [Callback] }
  } |
  {
    'Chunk' : {
      'id' : string,
      'chunk' : Uint8Array | number[],
      'callback' : [] | [Callback],
    }
  };
export interface anon_class_18_1 {
  'addAsset' : ActorMethod<[AssetRequest], Result_7>,
  'addCardCollection' : ActorMethod<
    [CardCollectionArgs, Array<CardArgs>],
    Result
  >,
  'deleteCard' : ActorMethod<[string], Result_6>,
  'deleteCardCollection' : ActorMethod<[string], Result>,
  'getAllCollections' : ActorMethod<[], Result_3>,
  'getCard' : ActorMethod<[CardArgs], Result_5>,
  'getCardCollection' : ActorMethod<[string], Result_4>,
  'getCollectionsByQuery' : ActorMethod<[string], Result_3>,
  'http_request' : ActorMethod<[Request], Response>,
  'http_request_streaming_callback' : ActorMethod<
    [StreamingCallbackToken],
    StreamingCallbackResponse
  >,
  'manageAuth' : ActorMethod<[AuthArgs], Result_2>,
  'staticStreamingCallback' : ActorMethod<
    [StreamingCallbackToken],
    StreamingCallbackResponse
  >,
  'testQueryA' : ActorMethod<[CardCollectionArgs], undefined>,
  'testQueryB' : ActorMethod<[Array<CardArgs>], undefined>,
  'updateCard' : ActorMethod<[CardArgs], Result_1>,
  'updateCardCollection' : ActorMethod<
    [CardCollectionArgs, Array<CardArgs>],
    Result
  >,
}
export interface _SERVICE extends anon_class_18_1 {}
