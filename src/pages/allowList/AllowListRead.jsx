import * as React from 'react';
import { useEffect, useState } from 'react';
import { Grid, Box, Button, Typography, CircularProgress, Container, Backdrop, Tooltip } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';
import canisters from '../../../canister_ids.json';
import { idlFactory as bRServiceIdl } from '../../IDLs/e-br-service/e_br_service.did.js';
import { Principal } from '@dfinity/principal';


const bRServiceId = process.env.NODE_ENV == "development" ? canisters.e_br_service.local : process.env.NODE_ENV == "staging" ? canisters.e_br_service.staging : canisters.e_br_service.ic;

const network =
  process.env.DFX_NETWORK ||
  (process.env.NODE_ENV === "production" ? "ic" : "local");
const host = network != "ic" ? "http://localhost:4943" : "https://mainnet.dfinity.network";
const whitelist = [bRServiceId];

export default function AllowListRead(props) {

  const navigate = useNavigate();
  const [connected, setConnected] = useState(false);
  const [allowedUsers, setAllowedUser] = useState([]);

  const columns = [
    {field: 'id', headerName: 'ID', width: 100},
    {field: 'principal', headerName: 'principal', width: 500}
  ];

  const rows = allowedUsers.map((ppal, key) => {
    return {
      id: key,
      principal: ppal
    };
  });

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

  const getAllowList = async () => {
    try {
      const bRService = await createActor(bRServiceId, bRServiceIdl);

      console.log('bRService', bRService);

      var variant = { AllowedUsers: { GetAll: null } }
      const allowResult = await bRService.manageAuth(variant);

      if ("ok" in allowResult) {
        allowResult.ok[0].map(ppal => {
          const varUsers = [];

          const newPpal = ppal.toText();
          varUsers.push(newPpal);
          setAllowedUser(varUsers);
        })
      } else {
        window.alert("Fail. Try again and report it.");
      };
    } catch (e) {
      console.log(e);
    }

  }


  useEffect(() => {
    verifyConnectionAndAgent()
    getAllowList();

  }, []);

  console.log(allowedUsers);

  return (
    <Container sx={{padding: '5% '}}>

      <Box sx={{
        padding: '2%'
      }}>

      <Button
          variant="contained"
          onClick={()=>{
          navigate(`/allow-list/add`);
          }
                    }>
          Add New Principal
      </Button>

      </Box>

    <Box sx={{ height: '100vh', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
    <Typography sx={{textAlign: 'center'}}>
              Developed by: Weavers Labs
    </Typography>
    </Container>
  )
};