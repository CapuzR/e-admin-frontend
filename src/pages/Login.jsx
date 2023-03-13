import PlugConnect from '@psychedelic/plug-connect';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Grid, Button} from '@mui/material';
import BRLogo from "../../assets/brLogo.png";
import { Typography } from "@mui/material";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from "react-router-dom";

const network =
  process.env.DFX_NETWORK ||
  (process.env.NODE_ENV === "production" ? "ic" : "local");
const host = network != "ic" ? "http://localhost:4943" : "https://mainnet.dfinity.network";
const whitelist = [];

export default function Login() {
  const navigate = useNavigate();
  const [ token, setToken ] = useState('');
  const [ connected, setConnected ] = useState(false);
  const [ loading, setLoading ] = useState(false);

  const createActor = async (id, idl)=> { 
    return await window.ic.plug.createActor({
      canisterId: id,
      interfaceFactory: idl,
    })
  };

  const handleChange = (event) => {
    setToken(event.target.value);
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
                <a onClick={()=>{ setLoading(true); }}>
                <PlugConnect
                  title="Connect"
                  whitelist={whitelist}
                  onConnectCallback={() => {
                    setConnected(true); 
                    setLoading(false); 
                    navigate("/collections");
                  }}
                  host={host}
                  dark
                />
                </a>
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