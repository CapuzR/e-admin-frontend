export const idlFactory = ({ IDL }) => {
  const Property = IDL.Rec();
  const Property__1 = IDL.Rec();
  const Value = IDL.Rec();
  const Value__1 = IDL.Rec();
  const InitArgs = IDL.Record({
    'allowedUsers' : IDL.Opt(IDL.Vec(IDL.Principal)),
    'auth' : IDL.Opt(IDL.Vec(IDL.Principal)),
    'admins' : IDL.Opt(IDL.Vec(IDL.Principal)),
    'environment' : IDL.Text,
    'gameServers' : IDL.Opt(IDL.Vec(IDL.Principal)),
  });
  const Callback = IDL.Func([], [], []);
  const WriteAsset = IDL.Variant({
    'Init' : IDL.Record({
      'id' : IDL.Text,
      'size' : IDL.Nat,
      'callback' : IDL.Opt(Callback),
    }),
    'Chunk' : IDL.Record({
      'id' : IDL.Text,
      'chunk' : IDL.Vec(IDL.Nat8),
      'callback' : IDL.Opt(Callback),
    }),
  });
  const AssetRequest = IDL.Variant({
    'Put' : IDL.Record({
      'key' : IDL.Text,
      'contentType' : IDL.Text,
      'callback' : IDL.Opt(Callback),
      'payload' : IDL.Variant({
        'StagedData' : IDL.Null,
        'Payload' : IDL.Vec(IDL.Nat8),
      }),
    }),
    'Remove' : IDL.Record({ 'key' : IDL.Text, 'callback' : IDL.Opt(Callback) }),
    'StagedWrite' : WriteAsset,
  });
  const StaticError = IDL.Variant({
    'Immutable' : IDL.Null,
    'NotFound' : IDL.Null,
    'NotAuthorized' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'AlreadyExists' : IDL.Null,
    'InvalidRequest' : IDL.Null,
    'AuthorizedPrincipalLimitReached' : IDL.Nat,
    'FailedToWrite' : IDL.Text,
  });
  const Result_7 = IDL.Variant({ 'ok' : IDL.Null, 'err' : StaticError });
  const Checkbox = IDL.Record({ 'options' : IDL.Vec(IDL.Text) });
  const FieldType = IDL.Variant({
    'TextField' : IDL.Text,
    'Range' : IDL.Vec(IDL.Nat),
    'Checkbox' : Checkbox,
  });
  const FilterDetails = IDL.Record({ 'kind' : FieldType, 'name' : IDL.Text });
  const Filter = IDL.Variant({
    'BountyRush' : IDL.Vec(FilterDetails),
    'Traits' : IDL.Vec(FilterDetails),
    'ElementumGeneral' : IDL.Vec(FilterDetails),
  });
  const CardCollectionArgs = IDL.Record({
    'filters' : IDL.Vec(Filter),
    'loreContext' : IDL.Text,
    'collectionId' : IDL.Text,
    'kind' : IDL.Text,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'batchUpdate' : IDL.Bool,
    'haveMultipleAC' : IDL.Bool,
    'standard' : IDL.Text,
  });
  Value.fill(
    IDL.Variant({
      'Int' : IDL.Int,
      'Nat' : IDL.Nat,
      'Nat16' : IDL.Nat16,
      'Nat32' : IDL.Nat32,
      'Nat64' : IDL.Nat64,
      'Blob' : IDL.Vec(IDL.Nat8),
      'Bool' : IDL.Bool,
      'Int8' : IDL.Int8,
      'Nat8' : IDL.Nat8,
      'Text' : IDL.Text,
      'Bytes' : IDL.Vec(IDL.Nat8),
      'Int16' : IDL.Int16,
      'Int32' : IDL.Int32,
      'Int64' : IDL.Int64,
      'Option' : IDL.Opt(Value),
      'Float' : IDL.Float64,
      'Principal' : IDL.Principal,
      'Array' : IDL.Vec(Value),
      'Class' : IDL.Vec(Property),
    })
  );
  Property.fill(IDL.Record({ 'value' : Value, 'name' : IDL.Text }));
  const CardStats = IDL.Variant({
    'BountyRush' : IDL.Vec(Property),
    'Traits' : IDL.Vec(Property),
    'ElementumGeneral' : IDL.Vec(Property),
  });
  const CardArgs = IDL.Record({
    'id' : IDL.Text,
    'url' : IDL.Text,
    'thumbnail' : IDL.Text,
    'collectionId' : IDL.Text,
    'mimeType' : IDL.Text,
    'stats' : IDL.Vec(CardStats),
    'index' : IDL.Nat,
    'collectionName' : IDL.Text,
  });
  const CardCollectionError = IDL.Variant({
    'CardCollectionAlreadyExists' : IDL.Null,
    'NotAuthorized' : IDL.Null,
    'Unknown' : IDL.Text,
    'NonExistentCardCollection' : IDL.Null,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : CardCollectionError });
  const CardError = IDL.Variant({
    'NotAuthorized' : IDL.Null,
    'Unknown' : IDL.Text,
    'CardAlreadyExists' : IDL.Null,
    'NonExistentCard' : IDL.Null,
  });
  const Result_6 = IDL.Variant({ 'ok' : IDL.Null, 'err' : CardError });
  const CardSuccess = IDL.Record({
    'id' : IDL.Text,
    'url' : IDL.Text,
    'thumbnail' : IDL.Text,
    'mimeType' : IDL.Text,
    'stats' : IDL.Vec(CardStats),
    'index' : IDL.Nat,
    'collectionName' : IDL.Text,
  });
  const CardCollectionSuccess = IDL.Record({
    'filters' : IDL.Vec(Filter),
    'loreContext' : IDL.Text,
    'collectionId' : IDL.Text,
    'cards' : IDL.Vec(CardSuccess),
    'kind' : IDL.Text,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'haveMultipleAC' : IDL.Bool,
    'standard' : IDL.Text,
  });
  const Result_3 = IDL.Variant({
    'ok' : IDL.Vec(CardCollectionSuccess),
    'err' : CardCollectionError,
  });
  Value__1.fill(
    IDL.Variant({
      'Int' : IDL.Int,
      'Nat' : IDL.Nat,
      'Nat16' : IDL.Nat16,
      'Nat32' : IDL.Nat32,
      'Nat64' : IDL.Nat64,
      'Blob' : IDL.Vec(IDL.Nat8),
      'Bool' : IDL.Bool,
      'Int8' : IDL.Int8,
      'Nat8' : IDL.Nat8,
      'Text' : IDL.Text,
      'Bytes' : IDL.Vec(IDL.Nat8),
      'Int16' : IDL.Int16,
      'Int32' : IDL.Int32,
      'Int64' : IDL.Int64,
      'Option' : IDL.Opt(Value__1),
      'Float' : IDL.Float64,
      'Principal' : IDL.Principal,
      'Array' : IDL.Vec(Value__1),
      'Class' : IDL.Vec(Property__1),
    })
  );
  Property__1.fill(IDL.Record({ 'value' : Value__1, 'name' : IDL.Text }));
  const CardStats__1 = IDL.Variant({
    'BountyRush' : IDL.Vec(Property__1),
    'Traits' : IDL.Vec(Property__1),
    'ElementumGeneral' : IDL.Vec(Property__1),
  });
  const Card = IDL.Record({
    'url' : IDL.Text,
    'thumbnail' : IDL.Text,
    'collectionId' : IDL.Text,
    'mimeType' : IDL.Text,
    'stats' : IDL.Vec(CardStats__1),
    'index' : IDL.Nat,
    'collectionName' : IDL.Text,
  });
  const Result_5 = IDL.Variant({ 'ok' : Card, 'err' : CardError });
  const Result_4 = IDL.Variant({
    'ok' : CardCollectionSuccess,
    'err' : CardCollectionError,
  });
  const HeaderField = IDL.Tuple(IDL.Text, IDL.Text);
  const Request = IDL.Record({
    'url' : IDL.Text,
    'method' : IDL.Text,
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HeaderField),
  });
  const StreamingCallbackToken = IDL.Record({
    'key' : IDL.Text,
    'index' : IDL.Nat,
    'content_encoding' : IDL.Text,
  });
  const StreamingCallbackResponse = IDL.Record({
    'token' : IDL.Opt(StreamingCallbackToken),
    'body' : IDL.Vec(IDL.Nat8),
  });
  const StreamingCallback = IDL.Func(
      [StreamingCallbackToken],
      [StreamingCallbackResponse],
      ['query'],
    );
  const StreamingStrategy = IDL.Variant({
    'Callback' : IDL.Record({
      'token' : StreamingCallbackToken,
      'callback' : StreamingCallback,
    }),
  });
  const Response = IDL.Record({
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HeaderField),
    'streaming_strategy' : IDL.Opt(StreamingStrategy),
    'status_code' : IDL.Nat16,
  });
  const RequestArgs = IDL.Variant({
    'Add' : IDL.Vec(IDL.Principal),
    'IsIn' : IDL.Principal,
    'Remove' : IDL.Principal,
    'RemoveAll' : IDL.Null,
    'GetAll' : IDL.Null,
    'IsCallerIn' : IDL.Null,
  });
  const AuthArgs = IDL.Variant({
    'Auth' : RequestArgs,
    'Admin' : RequestArgs,
    'GameServers' : RequestArgs,
    'AllowedUsers' : RequestArgs,
  });
  const Error = IDL.Variant({
    'NotAuthorized' : IDL.Null,
    'NonExistentRole' : IDL.Null,
  });
  const Result_2 = IDL.Variant({
    'ok' : IDL.Opt(IDL.Vec(IDL.Principal)),
    'err' : Error,
  });
  const UpdateCardError = IDL.Variant({
    'NotAuthorized' : IDL.Null,
    'Unknown' : IDL.Text,
    'NonExistentCard' : IDL.Null,
  });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Null, 'err' : UpdateCardError });
  const anon_class_18_1 = IDL.Service({
    'addAsset' : IDL.Func([AssetRequest], [Result_7], []),
    'addCardCollection' : IDL.Func(
        [CardCollectionArgs, IDL.Vec(CardArgs)],
        [Result],
        [],
      ),
    'deleteCard' : IDL.Func([IDL.Text], [Result_6], []),
    'deleteCardCollection' : IDL.Func([IDL.Text], [Result], []),
    'getAllCollections' : IDL.Func([], [Result_3], ['query']),
    'getCard' : IDL.Func([CardArgs], [Result_5], ['query']),
    'getCardCollection' : IDL.Func([IDL.Text], [Result_4], ['query']),
    'getCollectionsByQuery' : IDL.Func([IDL.Text], [Result_3], ['query']),
    'http_request' : IDL.Func([Request], [Response], ['query']),
    'http_request_streaming_callback' : IDL.Func(
        [StreamingCallbackToken],
        [StreamingCallbackResponse],
        ['query'],
      ),
    'manageAuth' : IDL.Func([AuthArgs], [Result_2], []),
    'staticStreamingCallback' : IDL.Func(
        [StreamingCallbackToken],
        [StreamingCallbackResponse],
        ['query'],
      ),
    'testQueryA' : IDL.Func([CardCollectionArgs], [], []),
    'testQueryB' : IDL.Func([IDL.Vec(CardArgs)], [], []),
    'updateCard' : IDL.Func([CardArgs], [Result_1], []),
    'updateCardCollection' : IDL.Func(
        [CardCollectionArgs, IDL.Vec(CardArgs)],
        [Result],
        [],
      ),
  });
  return anon_class_18_1;
};
export const init = ({ IDL }) => {
  const InitArgs = IDL.Record({
    'allowedUsers' : IDL.Opt(IDL.Vec(IDL.Principal)),
    'auth' : IDL.Opt(IDL.Vec(IDL.Principal)),
    'admins' : IDL.Opt(IDL.Vec(IDL.Principal)),
    'environment' : IDL.Text,
    'gameServers' : IDL.Opt(IDL.Vec(IDL.Principal)),
  });
  return [InitArgs];
};
