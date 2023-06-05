import * as React from 'react';
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Grid, Button} from '@mui/material';
import BRLogo from "../../assets/brLogo.png";
import { Typography } from "@mui/material";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from "react-router-dom";
import canisters from '../../canister_ids.json';

const host =
process.env.NODE_ENV == "development"
  ? "http://localhost:4943"
  : process.env.NODE_ENV == "staging"
  ? "https://icp0.io"
  : "https://icp0.io";
  
const eAId = process.env.NODE_ENV == "development" ? canisters.e_asset_manager.local : process.env.NODE_ENV == "staging" ? canisters.e_asset_manager.staging : canisters.e_asset_manager.ic;
const eTId = process.env.NODE_ENV == "development" ? canisters.e_tournament_manager.local : process.env.NODE_ENV == "staging" ? canisters.e_tournament_manager.staging : canisters.e_tournament_manager.ic;
const whitelist = [eAId, eTId];

export default function Login() {
  const navigate = useNavigate();
  const [ token, setToken ] = useState('');
  const [ connected, setConnected ] = useState(false);
  const [ loading, setLoading ] = useState(false);

  const onConnectionUpdate = () => {
    console.log(window.ic.plug.sessionManager.sessionData)
  };

  const handleConnection = async () => {
    await window.ic.plug.requestConnect({
      whitelist,
      host,
      onConnectionUpdate,
      timeout: 50000
    });
    navigate("/collections");
  };

  const verifyConnectionAndAgent = async () => {
    const connected = await window.ic.plug.isConnected();
    if (!connected) window.ic.plug.requestConnect({ whitelist, host });
    if (connected && !window.ic.plug.agent) {
      window.ic.plug.createAgent({ whitelist, host })
    }
    setConnected(true);
  };
  
  useEffect(() => {
    verifyConnectionAndAgent();
  }, []);

  return (
    <div>
      {
        loading &&
        <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      }
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} style={{marginTop: "10vh"}}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <img src={BRLogo}/>
            </Grid>
            <Grid item xs={12} textAlign="center">
              <Typography>
                Admin
              </Typography>
            </Grid>
            <Grid item xs={3} textAlign="center">
            </Grid>
            <Grid item xs={12} md={6} textAlign="center">
              <Grid item xs={12} textAlign="center">
                <Button onClick={()=>{ handleConnection() }}>Connect</Button>
              </Grid>
            </Grid>
            <Grid item xs={3} textAlign="center">
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} style={{marginTop: "10vh", position: "absolute", bottom: 10}}>
          <Grid item xs={12} textAlign="center">
            <Typography>
              Developed by: Weavers Labs
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};