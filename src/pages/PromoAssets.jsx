import * as React from 'react';
import { useEffect, useState } from 'react';
import { 
  Grid, 
  Button, 
  Typography, 
  Backdrop, 
  CircularProgress, 
  TextField,
  Avatar,
  Input,
  Paper, 
  Checkbox, 
  FormControl,
  InputLabel, Select,
  IconButton
} from '@mui/material';
import { useNavigate, useParams } from "react-router-dom";
import { idlFactory as eAIdlFactory } from '../IDLs/e-asset-manager/e_asset_manager.did.js';
import canisters from '../../canister_ids.json';
import { getAllNFTS } from '@psychedelic/dab-js';
import { HttpAgent } from "@dfinity/agent";
import { Principal } from '@dfinity/principal';
import { readAndCompressImage } from "browser-image-resizer";

const eAId = process.env.NODE_ENV == "development" ? canisters.e_asset_manager.local : process.env.NODE_ENV == "staging" ? canisters.e_asset_manager.staging : canisters.e_asset_manager.ic;

const host =
process.env.NODE_ENV == "development"
  ? "http://localhost:4943"
  : process.env.NODE_ENV == "staging"
  ? "https://icp0.io"
  : "https://icp0.io";
  
  const whitelist = [];

export default function CollectionForm() {
  const [ connected, setConnected ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const { id } = useParams();
  const [blob, setBlob] = useState(null);
  const [asset, setAsset] = useState("");
  const [assetName, setAssetName] = useState("");

  const verifyConnectionAndAgent = async () => {
    const connected = await window.ic.plug.isConnected();
    if (!connected) window.ic.plug.requestConnect({ whitelist, host });
    if (connected && !window.ic.plug.agent) {
      window.ic.plug.createAgent({ whitelist, host })
    }
    setConnected(true);
  };

  const createActor = async (canisterid, idl)=> { 
    return await window.ic.plug.createActor({
      canisterId: canisterid,
      interfaceFactory: idl,
    })
  };

  useEffect(() => {
    verifyConnectionAndAgent();
    
  }, []);

  const convertToBase64 = (blob) => {
    return new Promise((resolve) => {
      var reader = new FileReader();
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  }; 

  const handleChangeAsset = async (event) => {
    const file = event.target.files[0];

    let config = {
      quality: 1,
      maxWidth: 1080,
      maxHeight: 1080,
      autoRotate: true,
      debug: true,
    };

    let resizedImage = await readAndCompressImage(file, config);

    const resizedString = await convertToBase64(file);
    const data = [...new Uint8Array(await resizedImage.arrayBuffer())];

    setBlob(data);
    setAsset(resizedString);
  };

  const addAsset = async () => {
    try {
    let actor = await createActor(eAId, eAIdlFactory);
    console.log(actor);
    const result = await actor.addAsset({
          Put: {
            callback: [],
            contentType: "image/png",
            key: assetName,
            payload: {
              Payload: blob,
            },
          }
      });
      console.log("Asset Result");
    } catch (err) {
      console.log("error uploading asset:", err);
    }
  };

  return (
    <div>
      {
        loading &&
          <Backdrop
            sx={{ color: '#000', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
      }
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={8} style={{marginTop: "10vh"}}>
          <Paper elevation={3} style={{ width: '50%', marginTop: 10, height: 300, padding: 30 }}>
            <Grid container spacing={2} style={{ width: '100%', height: "100%", position: "relative" }}>
              <Grid item container xs={12} spacing={3} style={{ padding: 50}}>
                <Grid item xs={12}>
                    <IconButton component="label">
                    <Avatar
                        style={{ width: "120px", height: "120px" }}
                        src={asset}
                    />
                    <input
                        hidden
                        type="file"
                        onChange={handleChangeAsset}
                    />
                    </IconButton>{" "}
                </Grid>
                <Grid item xs={12}>
                    <Input
                        value={assetName}
                        variant="standard"
                        onChange={(event) => setAssetName(event.target.value)}
                        style={{
                            color: "#000",
                        }}
                    />
                </Grid>
              </Grid>
              <Grid item style={{ position: "absolute", bottom: 0, right: 0 }}>
                  <Button 
                      variant="contained"
                      onClick={()=>{
                        addAsset();
                      }
                  }>
                      {!id ? "Add" : "Update"}
                  </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} style={{ position: "absolute", bottom: 10}}>
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