import * as React from 'react';
import { useEffect, useState } from 'react';
import { 
  Grid, 
  Button, 
  Typography, 
  Backdrop, 
  CircularProgress, 
  TextField,
  Paper, 
  Checkbox, 
  FormControl,
  InputLabel, Select,
  MenuItem
} from '@mui/material';
import { useNavigate, useParams } from "react-router-dom";
import { idlFactory as eAIdlFactory } from '../IDLs/e-asset-manager/e_asset_manager.did.js';
import canisters from '../../canister_ids.json';
import { getAllNFTS } from '@psychedelic/dab-js';
import { HttpAgent } from "@dfinity/agent";
import { Principal } from '@dfinity/principal';

const eAId = process.env.NODE_ENV == "development" ? canisters.e_asset_manager.local : process.env.NODE_ENV == "staging" ? canisters.e_asset_manager.staging : canisters.e_asset_manager.ic;

const host =
process.env.NODE_ENV == "development"
  ? "http://localhost:4943"
  : process.env.NODE_ENV == "staging"
  ? "https://icp0.io"
  : "https://icp0.io";
  
  const whitelist = [];

export default function CollectionForm() {
  const navigate = useNavigate();
  const [ canisterId, setCanisterId ] = useState('');
  const [ name, setName ] = useState('');
  const [ description, setDescription ] = useState('');
  const [ loreContext, setLoreContext ] = useState('');
  const [ filters, setFilters ] = useState('');
  const [ haveMultipleAC, setHaveMultipleAC ] = useState(false);
  const [ batchUpdate, setBatchUpdate ] = useState(false);
  const [ standard, setStandard ] = useState('');
  const [ cards, setCards ] = useState('');
  const [ connected, setConnected ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const [type, setType] = useState('');
  const { id } = useParams();
  const [ nftCollection, setNftCollection ] = useState([]);
  const [ nftCollectionsArr, setNftCollectionsArr ] = useState([]);
  const [ isDab, setIsDab ] = useState(id ? false : true);

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
    if (id) {
      setLoading(true);
      getCollections();
    } 
    else {
      getNFTList();
    };
  }, []);

  const getCollections = async ()=> {
    try {
      console.log("eAId", eAId);
      const eAMActor = await createActor(eAId, eAIdlFactory);
      console.log("eAMActor", eAMActor);
      const cardCollectionRes = await eAMActor.getCardCollection(id);
      console.log("cardCollectionRes", cardCollectionRes);

      if ("ok" in cardCollectionRes) {
        console.log(cardCollectionRes);
        setCanisterId(id);
        setName(cardCollectionRes.ok.name);
        setStandard(cardCollectionRes.ok.standard);
        setDescription(cardCollectionRes.ok.description);
        setType(cardCollectionRes.ok.kind);
        setLoreContext(cardCollectionRes.ok.loreContext);
        setHaveMultipleAC(cardCollectionRes.ok.haveMultipleAC);
        setLoading(false);
        
      } else {
        window.alert("Error. Please refresh and report it.");
      };
    } catch (e) {
      window.alert("Unexpected error. Please try again and report it.");
    };
  };
  
  const handleChange = (event) => {
    setType(event.target.value);
  };

  const nftCollectionHandleChange = (event) => {
    const selectedCollection = nftCollectionsArr.find(coll => coll.principal_id.toText() == event.target.value);
    setCanisterId(selectedCollection.principal_id.toText());
    setName(selectedCollection.name);
    setStandard(selectedCollection.standard);
    setType("External");
    setNftCollection(event.target.value);
  };

  const getNFTList = async () => {
    const agent = new HttpAgent({ host: host });
    const collections = await getAllNFTS(
      agent,
      Principal.from("2vxsx-fae")
    );
    
    setNftCollectionsArr(collections);
  };

  const getStatsArrays = (card, array)=> {
    card.stats.map((stat, i)=>{
      array.push(stat);
    });
    return array;
  };

  const getTraitsArray = (prevArray, array)=> {
    prevArray[0].Traits.map((stat, i)=>{
      array.push(stat);
    });
    return array;
  };

  const getElementumGeneralArray = (prevArray, array)=> {
    prevArray[1].ElementumGeneral.map((stat, i)=>{
      array.push(stat);
    });
    return array;
  };

  const getBountyRusArray = (prevArray, array)=> {
    prevArray[2].BountyRush.map((stat, i)=>{
      array.push(stat);
    });
    return array;
  };

  function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
  }

  const addNewCollection = async ()=> {
    setLoading(true);
    const rawCards = JSON.parse(cards);
    const cardsArray = [];
    
    rawCards.map((card, index)=> {

        let traitsArray = [];
        let elementumGeneralArray = [];
        let bountyRusArray = [];
        traitsArray = getTraitsArray(card.stats, traitsArray);
        elementumGeneralArray = getElementumGeneralArray(card.stats, elementumGeneralArray);
        bountyRusArray = getBountyRusArray(card.stats, bountyRusArray);

      cardsArray.push({
        id : card.id,
        index : index,
        url : card.url,
        thumbnail : card.thumbnail,
        collectionName : card.collectionName,
        collectionId : canisterId,
        mimeType : card.mimeType,
        stats : [
          {
            Traits: traitsArray
          },
          {
            ElementumGeneral: elementumGeneralArray
          },
          {
            BountyRush: bountyRusArray
          }
        ]
      });

    });

    let rawFilters = JSON.parse(filters);

    const cardsCollection = {
      collectionId: canisterId,
      name,
      description,
      kind: type,
      loreContext,
      standard,
      haveMultipleAC,
      batchUpdate: true,
      filters: rawFilters
    };
    

    try {
      const eAMActor = await createActor(eAId, eAIdlFactory);
      const cardCollections = await eAMActor.addCardCollection(cardsCollection, cardsArray);

      if ("ok" in cardCollections) {
        setLoading(false);
        navigate('/collections');
      } else {
        setLoading(false);
        window.alert("Fail. Try again and report it.");
      };
    } catch (e) {
      setLoading(false);
      window.alert("Unexpected error. Please try again and report it.");
      console.log("Unexpected error:", e);
    };
  };

  const updateCollection = async ()=> {
    setLoading(true);
    const rawCards = JSON.parse(cards);
    const cardsArray = [];
    
    rawCards.map((card, index)=> {

        let traitsArray = [];
        let elementumGeneralArray = [];
        let bountyRusArray = [];
        traitsArray = getTraitsArray(card.stats, traitsArray);
        elementumGeneralArray = getElementumGeneralArray(card.stats, elementumGeneralArray);
        bountyRusArray = getBountyRusArray(card.stats, bountyRusArray);

      cardsArray.push({
        id : card.id,
        index : index,
        url : card.url,
        thumbnail : card.thumbnail,
        collectionName : card.collectionName,
        collectionId : canisterId,
        mimeType : card.mimeType,
        stats : [
          {
            Traits: traitsArray
          },
          {
            ElementumGeneral: elementumGeneralArray
          },
          {
            BountyRush: bountyRusArray
          }
        ]
      });

    });

    let rawFilters = JSON.parse(filters);

    const cardsCollection = {
      collectionId: canisterId,
      name,
      kind: type,
      description,
      loreContext,
      standard,
      haveMultipleAC,
      batchUpdate,
      filters: rawFilters
    };

    try {
      const eAMActor = await createActor(eAId, eAIdlFactory);
      console.log("eAMActor", eAMActor);
      const cardCollections = await eAMActor.updateCardCollection(cardsCollection, cardsArray);
      console.log("cardCollections", cardCollections);
      
      if ("ok" in cardCollections) {
        setLoading(false);
        navigate('/collections');
      } else {
        setLoading(false);
        window.alert("Fail. Please try again and report it.");
      };
    } catch (e) {
      console.log(e);
      setLoading(false);
      window.alert("Unexpected error. Please try again and report it.");
    };
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
          <Paper elevation={3} style={{ width: '100%', marginTop: 10, height: 600, padding: 30 }}>
            <Grid container spacing={2} style={{ width: '100%', height: "100%", position: "relative" }}>
              <Grid item container xs={12} spacing={3} style={{ padding: 50}}>
                <Grid item container xs={12} alignContent="center">
                  {
                    !id &&
                    <Grid item container xs={6} alignContent="center">
                      <Grid item xs={2}>
                        <Checkbox id="isDab" variant="outlined" checked={isDab} onClick={()=>{setIsDab(!isDab)}} />
                      </Grid>
                      <Grid item xs={10} style={{paddingTop: 9}}>
                        <Typography>Is a DAB collection</Typography>
                      </Grid>
                    </Grid>
                  }
                  {
                    isDab &&
                      <Grid item xs={6} sx={{}}>
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">NFT Collection</InputLabel>
                          <Select
                            labelId="nftColl-select-label"
                            id="nftColl-select"
                            value={nftCollection}
                            label="NFT Collection"
                            onChange={nftCollectionHandleChange}
                          >
                            {
                              nftCollectionsArr.map((coll)=>(
                                <MenuItem value={coll.principal_id.toText()}>{coll.name}</MenuItem>
                              ))
                            }
                            <MenuItem value=""></MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                  }
                </Grid>
                {
                !isDab &&
                  <>
                    <Grid item xs={3}>
                      <TextField id="input-with-sx" label="Canister Id" variant="outlined" value={canisterId} fullWidth onChange={(e)=>{setCanisterId(e.target.value)}} />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField id="input-with-sx" label="Name" variant="outlined" value={name} fullWidth onChange={(e)=>{setName(e.target.value)}} />
                    </Grid>
                    <Grid item xs={3}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Type</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={type}
                          label="Type"
                          onChange={handleChange}
                        >
                          <MenuItem value={"Internal"}>Internal</MenuItem>
                          <MenuItem value={"External"}>External</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                      <TextField id="input-with-sx" label="Standard" variant="outlined" value={standard} fullWidth onChange={(e)=>{setStandard(e.target.value)}} />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField id="input-with-sx" label="Description" variant="outlined" value={description} fullWidth multiline rows={3} onChange={(e)=>{setDescription(e.target.value)}} />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField id="input-with-sx" label="Lore" variant="outlined" value={loreContext} fullWidth multiline rows={3} onChange={(e)=>{setLoreContext(e.target.value)}} />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField id="input-with-sx" label="Filters" variant="outlined" value={filters} fullWidth multiline rows={3} onChange={(e)=>{setFilters(e.target.value)}} />
                    </Grid>
                  </>
                }
                {/* <Grid item container xs={6} alignContent="center">
                  <Grid item xs={2}>
                    <Checkbox id="multipleAC" variant="outlined" checked={haveMultipleAC} onClick={()=>{setHaveMultipleAC(!haveMultipleAC)}} />
                  </Grid>
                  <Grid item xs={10} style={{paddingTop: 9}}>
                    <Typography>Multiple Asset Canisters</Typography>
                  </Grid>
                </Grid> */}
                {
                  id &&
                <Grid item container xs={6} alignContent="center">
                  <Grid item xs={2}>
                    <Checkbox id="batchUpdate" variant="outlined" checked={batchUpdate} onClick={()=>{setBatchUpdate(!batchUpdate)}} />
                  </Grid>
                  <Grid item xs={10} style={{paddingTop: 9}}>
                    <Typography>Batch update cards</Typography>
                  </Grid>
                </Grid>
                }
                {
                  (!id || batchUpdate) &&
                  <Grid item xs={12}>
                    <TextField id="input-with-sx" label="Cards JSON" variant="outlined" value={cards} fullWidth multiline rows={3} onChange={(e)=>{setCards(e.target.value)}} />
                  </Grid>
                }
              </Grid>
              <Grid item style={{ position: "absolute", bottom: 0, right: 0 }}>
                  <Button 
                      variant="contained"
                      onClick={()=>{
                        !id ?
                        addNewCollection() :
                        updateCollection()
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