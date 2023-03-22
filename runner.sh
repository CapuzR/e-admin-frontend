E_ADMIN_FRONTEND_PATH=$ELEMENTUM_PATH"/general/e-admin-frontend"

cd $E_ADMIN_FRONTEND_PATH

if [ ! -d "./node_modules" ]
then
    npm install
fi

if [ $E_ADMIN_FRONTEND_ENV = "local" ] 
then
    dfx canister create e_admin_frontend >/dev/null
fi

echo $(dfx canister id e_admin_frontend);

dfx build --network $E_ADMIN_FRONTEND_ENV e_admin_frontend >/dev/null

if [ $INSTALL_MODE = "none" ]
then
    dfx canister install --network $E_ADMIN_FRONTEND_ENV e_admin_frontend >/dev/null
else
    dfx canister install --mode $INSTALL_MODE --network $E_ADMIN_FRONTEND_ENV e_admin_frontend >/dev/null
fi

if [ $EXECUTION_TYPE = "multiple" ]
then
    #Puts canisterIds into the canister_ids.json file.
    jq '.e_asset_manager.local = "'$S_E_ASSET_MANAGER_CANID'"' $E_ADMIN_FRONTEND_PATH/canister_ids.json > tmp.$$.json && mv tmp.$$.json $E_ADMIN_FRONTEND_PATH/canister_ids.json
    jq '.e_tournament_manager.local = "'$S_E_TOURNAMENT_MANAGER_CANID'"' $E_ADMIN_FRONTEND_PATH/canister_ids.json > tmp.$$.json && mv tmp.$$.json $E_ADMIN_FRONTEND_PATH/canister_ids.json
    rm -r $E_ADMIN_FRONTEND_PATH"/src/IDLs/e-asset-manager";
    cp -r $ELEMENTUM_PATH"/general/e-asset-manager/src/declarations/e_asset_manager" $E_ADMIN_FRONTEND_PATH"/src/IDLs/e-asset-manager";
    rm -r $E_ADMIN_FRONTEND_PATH"/src/IDLs/e-tournament-manager";
    cp -r $ELEMENTUM_PATH"/general/e-tournament-manager/src/declarations/e_tournament_manager" $E_ADMIN_FRONTEND_PATH"/src/IDLs/e-tournament-manager";
fi