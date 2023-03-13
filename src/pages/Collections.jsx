import * as React from 'react';
import { useEffect, useState } from 'react';
import { Grid, Button, Typography, CircularProgress, Backdrop, TextField } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';
import canisters from '../../../../canister_ids.json';
import { idlFactory as eAIdlFactory } from '../../../declarations/eAssetManager/index.js';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FilterIcon from '@mui/icons-material/Filter';

const network =
  process.env.DFX_NETWORK ||
  (process.env.NODE_ENV === "production" ? "ic" : "local");
const host = network != "ic" ? "http://localhost:4943" : "https://mainnet.dfinity.network";
const eAId = process.env.NODE_ENV == "development" ? canisters.eAssetManager.local : process.env.NODE_ENV == "staging" ? canisters.eAssetManager.staging : canisters.eAssetManager.ic;
const eTId = process.env.NODE_ENV == "development" ? canisters.eTournamentManager.local : process.env.NODE_ENV == "staging" ? canisters.eTournamentManager.staging : canisters.eTournamentManager.ic;
    console.log(eAId);
const whitelist = [];

export default function Collections() {
  const navigate = useNavigate();
  const [ connected, setConnected ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const [selectionModel, setSelectionModel] = useState([]);
  const [ cardColls, setCardColls ] = useState([]);
  const [ search, setSearch ] = useState("");

  const createActor = async (id, idl)=> {
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

  const getCollections = async ()=> {
    try {

      const eAActor = await createActor(eAId, eAIdlFactory);
      console.log("eAActor", eAActor);
      const cardCollections = await eAActor.getAllCollections();

      if ("ok" in cardCollections) {
        let cardCollArr = [];
        cardCollections.ok.map((cardColl)=>{
          cardCollArr.push({
            id: cardColl.collectionId,
            name: cardColl.name,
            standard: cardColl.standard.toUpperCase(),
            description: cardColl.description,
            kind: cardColl.kind,
            loreContext: cardColl.loreContext,
            haveMultipleAC: cardColl.haveMultipleAC
          });
        });
        setCardColls(cardCollArr);
        setLoading(false);
      } else {
        window.alert("Error. Please try again and report it.");
      };
    } catch (e) {
      console.log(e);
      window.alert("Unexpected error. Please try again and report it.");
    };
  };

  const getCollectionsByQuery = async ()=> {
    try {
      setLoading(true);
      verifyConnectionAndAgent();
      if(!search){
        getCollections();
      };
      const eAActor = await createActor(eAId, eAIdlFactory);
      console.log("eAActor", eAActor);
      const cardCollections = await eAActor.getCollectionsByQuery(search);

      if ("ok" in cardCollections) {
        let cardCollArr = [];
        cardCollections.ok.map((cardColl)=>{
          cardCollArr.push({
            id: cardColl.collectionId,
            name: cardColl.name,
            standard: cardColl.standard.toUpperCase(),
            description: cardColl.description,
            kind: cardColl.kind,
            loreContext: cardColl.loreContext,
            haveMultipleAC: cardColl.haveMultipleAC
          });
        });
        setCardColls(cardCollArr);
        setLoading(false);
      } else {
        window.alert("Error. Please try again and report it.");
      };
    } catch (e) {
      console.log(e);
      window.alert("Unexpected error. Please try again and report it.");
    };
  };

  const deleteCollection = async ()=> {
    try {
      const eAActor = await createActor(eAId, eAIdlFactory);
      const cardCollections = await eAActor.deleteCardCollection(selectionModel[0]);

      if ("ok" in cardCollections) {
        location.reload();
      } else {
        window.alert("Fail. Try again and report it.");
      };
    } catch (e) {
      window.alert("Unexpected error. Please try again and report it.");
    };
  };
  
  useEffect(() => {
    setLoading(true);
    verifyConnectionAndAgent();
    getCollections();
  }, []);

const columns = [
    { field: 'id', headerName: 'ID', width: 230 },
    { field: 'name', headerName: 'Name', width: 170 },
    { field: 'description', headerName: 'Description', width: 240 },
    { field: 'kind', headerName: 'Type', width: 120 },
    { field: 'loreContext', headerName: 'Lore', width: 240 },
    { field: 'standard', headerName: 'Standard', width: 100 },
    {
      field: 'haveMultipleAC',
      headerName: 'Multiple Asset Canisters',
      type: 'boolean', 
      width: 230
    },
  ];
  
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
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={8} style={{marginTop: "7vh"}}>
            <Grid container justifyContent="right" spacing={2} style={{ width: '100%' }}>
                <Grid item xs={3}>
                  <TextField id="input-with-sx" value={search} label="Search bar" variant="outlined" fullWidth onChange={(e)=>{setSearch(e.target.value)}} />
                </Grid>
                <Grid item>
                    <Button 
                        variant="contained"
                        onClick={()=>{
                          getCollectionsByQuery();
                        }
                    }>
                        Search
                    </Button>
                </Grid>
                <Grid item>
                    <Button 
                        variant="contained"
                        onClick={()=>{
                            navigate(`/collection/new`);
                        }
                    }>
                        +
                    </Button>
                </Grid>
            </Grid>
            {
                selectionModel.length != 0 &&
                <Grid container spacing={2} justifyContent="start" style={{ width: '100%' }}>
                    {
                        selectionModel.length == 1 &&
                            <Grid item>
                                <Button onClick={()=>{
                                    setSelectionModel(!selectionModel)
                                    navigate(`/collection/${selectionModel[0]}/cards`);
                                }}>
                                    <FilterIcon />
                                </Button>
                            </Grid>
                    }
                    <Grid item>
                        <Button onClick={()=>{
                            setSelectionModel(!selectionModel)
                            navigate(`/collection/${selectionModel[0]}/update`);
                        }}>
                            <EditIcon/>
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button onClick={()=>{
                            deleteCollection();
                        }}>
                            <DeleteIcon/>
                        </Button>
                    </Grid>
              </Grid>
            }
          <Grid container spacing={2} style={{ height: 500, width: '100%', marginTop: 10 }}>
            <DataGrid
                rows={cardColls}
                columns={columns}
                pageSize={7}
                rowsPerPageOptions={[7]}
                checkboxSelection
                onSelectionModelChange={setSelectionModel}
                selectionModel={selectionModel}
            />
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