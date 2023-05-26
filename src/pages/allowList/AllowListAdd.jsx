import React, { useEffect, useState } from 'react';
import { Grid, TextField, Box, Button, Typography, CircularProgress, Container, Backdrop, Tooltip } from '@mui/material';
import { useNavigate } from "react-router-dom";
import canisters from '../../../canister_ids.json';
import { idlFactory as bRServiceIdl } from '../../IDLs/e_br_service/e_br_service.did.js';
import { Principal } from '@dfinity/principal';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const bRServiceId = process.env.NODE_ENV == "development" ? canisters.e_br_service.local : process.env.NODE_ENV == "staging" ? canisters.e_br_service.staging : canisters.e_br_service.ic;

const network =
    process.env.DFX_NETWORK ||
    (process.env.NODE_ENV === "production" ? "ic" : "local");
const host = network != "ic" ? "http://localhost:4943" : "https://mainnet.dfinity.network";
const whitelist = [bRServiceId];

export default function AllowListAdd() {

    const navigate = useNavigate();
    const [connected, setConnected] = useState(false);
    const [allowedUsers, setAllowedUser] = useState([]);
    const [error, setError] = useState({value: false, message: "Principal"});

    const createActor = async (id, idl) => {
        console.log(host);
        // console.log(canisterId);
        return await window.ic.plug.createActor({
            canisterId: id,
            interfaceFactory: idl,
        })
    };

    const verifyConnectionAndAgent = async () => {
        const connected = await window.ic.plug.isConnected();
        if (!connected) window.ic.plug.requestConnect({ whitelist, host });
        if (connected && !window.ic.plug.agent) {
            window.ic.plug.createAgent({ whitelist, host })
        }
        setConnected(true);
    };

    const transformPpal = async (text) => {

        const varPpals = [];

        const iterPpals = text.split(',');

        iterPpals.map((ppal, key) => {
            try{
            varPpals.push(Principal.fromText(ppal));
            setError({value : false, message: "Principal"});
            }catch(e){
                setError({value :true, message: "Error: Invalid value"});
            }
        });

        setAllowedUser(varPpals);

    };

    const manageAuth = async () => {
        try{
        const bRService = await createActor(bRServiceId, bRServiceIdl);

        var variant = { AllowedUsers: { Add: allowedUsers } }

        const result = await bRService.manageAuth(variant);

        console.log(result);
    }catch(e){
        console.log(e)
        window.alert(e);
    };
    };

    useEffect(() => {

        verifyConnectionAndAgent();

    }, []);

    return (
        <Container>
            <Box sx={{ padding: '10%' }} component="form">
                {
                    error.value ? 
                    <Box >
                    <TextField error multiline fullWidth={true} label="Error" color="error" helperText={error.message} onChange={(a) => {
                        transformPpal(a.target.value);
                    }} variant="outlined" />
                        <Button sx={{width: '100%', marginTop: 2}}  disabled>
                            Add
                        </Button>
                    </Box>
                    :
                    <Box >
                        <Box sx={{display: 'flex', alignItems: 'center', }}>
                <TextField fullWidth={true} multiline label={error.message} onChange={(a) => {
                    transformPpal(a.target.value);
                }} variant="outlined" />
                    <Tooltip title="Se debe agregar la lista de principals seguidos de comas y sin espacios. Por ejemplo:
                    `<principalID>,<principalID>,<principalID>`" color="primary">
                                        <ErrorOutlineIcon>
                                        </ErrorOutlineIcon>
                                        </Tooltip>
                </Box>
                <Button sx={{width: '100%', marginTop: 2}} variant="contained" onClick={manageAuth}>
                    Add
                </Button>
            </Box>

              }   
            </Box>
            <Box>
               
            </Box>
            <Typography sx={{textAlign: 'center'}}>
              Developed by: Weavers Labs
            </Typography>
        </Container>
    );
};