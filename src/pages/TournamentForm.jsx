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
  Input,
  InputLabel, 
  OutlinedInput,
  ListItemText,
  Select,
  Menu,
  MenuItem
} from '@mui/material';
import { useNavigate, useParams } from "react-router-dom";
import { canisterId as eTId, idlFactory as eTIDLFactory } from '../../../declarations/eTournamentManager/index.js';
import { canisterId as eAId, idlFactory as eAIdlFactory } from '../../../declarations/eAssetManager/index.js';
import { boostsSetAtArr, boostsSetPerArr, statusArr } from '../selects.js';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const network =
  process.env.DFX_NETWORK ||
  (process.env.NODE_ENV === "production" ? "ic" : "local");
  const host = network != "ic" ? "http://localhost:4943" : "https://mainnet.dfinity.network";
  const whitelist = [];


  
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

export default function TournamentForm() {
  const navigate = useNavigate();
  const [ name, setName ] = useState('');
  const [ description, setDescription ] = useState('');
  const [ startDate, setStartDate ] = useState('');
  const [ endDate, setEndDate ] = useState('');
  const [ internalCollections, setinternalCollections ] = useState([]);
  const [ externalCollections, setexternalCollections ] = useState([]);
  const [ boostsSetAt, setBoostsSetAt ] = useState('');
  const [ boostsSetPer, setBoostsSetPer ] = useState('');
  const [ game, setGame ] = useState('');
  const [ status, setStatus ] = useState("")
  const [ points, setPoints] = useState(0);
  const [ reward, setReward ] = useState('');
  const [ internalCollectionsArr, setinternalCollectionsArr ] = useState([]);
  const [ externalCollectionsArr, setexternalCollectionsArr ] = useState([]);
  const [ dynamicExplanation, setDynamicExplanation ] = useState('');
  const [ connected, setConnected ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const { id } = useParams();

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
    setLoading(true);
    verifyConnectionAndAgent();
    getCollections();
    if (id) {
      getTournament();
    };
    setLoading(false);
  }, []);

  const getCollections = async ()=> {
    try {
      setLoading(true);
      const eAActor = await createActor(eAId, eAIdlFactory);
      const cardCollections = await eAActor.getAllCollections();

      if ("ok" in cardCollections) {
        let iCollArr = [];
        let eCollArr = [];
        cardCollections.ok.map((cardColl)=>{
          if(cardColl.kind == "Internal") {
            iCollArr.push(cardColl);
          } else {
            eCollArr.push(cardColl);
          };
        });

        setinternalCollectionsArr(iCollArr);
        setexternalCollectionsArr(eCollArr);
      } else {
        window.alert("Error. Please try again and report it.");
      };
    } catch (e) {
      console.log(e);
      window.alert("Unexpected error. Please try again and report it.");
    };
  };

  const getTournament = async ()=> {
    try {
      const eTActor = await createActor(eTId, eTIDLFactory);
      const tournamentRes = await eTActor.getTournament(id);

      if ("ok" in tournamentRes) {
        setName(tournamentRes.ok.name);
        setDescription(tournamentRes.ok.description);
        setPoints(parseInt(tournamentRes.ok.points));
        setReward(tournamentRes.ok.reward);
        setStartDate(tournamentRes.ok.startDate);
        setEndDate(tournamentRes.ok.endDate);
        setinternalCollections(tournamentRes.ok.internalCollections);
        setexternalCollections(tournamentRes.ok.externalCollections);
        setBoostsSetAt(tournamentRes.ok.boostsSetAt);
        setBoostsSetPer(tournamentRes.ok.boostsSetPer);
        setStatus(tournamentRes.ok.status);
        setGame(tournamentRes.ok.game);
        setDynamicExplanation(tournamentRes.ok.dynamicExplanation);
        setLoading(false);

        console.log("stat", status);
        
      } else {
        window.alert("Error. Please refresh and report it.");
      };
    } catch (e) {
      window.alert("Unexpected error. Please try again and report it.");
    };
  };
  
  const gameHandleChange = (event) => {
    setGame(event.target.value);
  };

  const externalCollHandleChange = (event, e) => {
    
    let isIn = false;
    let array = [];

    externalCollections.map((c, i)=> {
      if (c.id == e.props.value.id) {
        isIn = true;
      } else {
        array.push(c);
      };
    });

    if(!isIn) {
      array.push({
        id: e.props.value.id,
        name: e.props.value.name,
      });
    };
    
    setexternalCollections(array);
  };

  const internalCollHandleChange = (event, e) => {
    
    let isIn = false;
    let array = [];

    internalCollections.map((c, i)=> {
      if (c.id == e.props.value.id) {
        isIn = true;
      } else {
        array.push(c);
      };
    });

    if(!isIn) {
      array.push({
        id: e.props.value.id,
        name: e.props.value.name,
      });
    };
    
    setinternalCollections(array);
  };

  const boostsSetAtHandleChange = (event) => {
    setBoostsSetAt(event.target.value);
  };

  const boostsSetPerHandleChange = (event) => {
    setBoostsSetPer(event.target.value);
  };

  const handleChangeStatus = (event) => {
    setStatus(event.target.value);
  }

  const addNewTournament = async ()=> {
    setLoading(true);

    const tournament = {
      name,
      description,
      status: JSON.parse(status),
      points, 
      reward,
      startDate: startDate.toString(),
      endDate: endDate.toString(),
      internalCollections,
      externalCollections,
      boostsSetAt,
      boostsSetPer,
      game,
      dynamicExplanation
    };

    try {
      const eTActor = await createActor(eTId, eTIDLFactory);
      const tournamentRes = await eTActor.addTournament(tournament);

      if ("ok" in tournamentRes) {
        setLoading(false);
        navigate('/tournaments');
      } else {
        setLoading(false);
        window.alert("Fail. Try again and report it.");
      };
    } catch (e) {
      setLoading(false);
      console.log(e);
      window.alert("Unexpected error. Please try again and report it.");
    };
  };

  const updateTournament = async (e, tournamentId)=> {
    setLoading(true);
    const tournament = {
      name,
      description,
      startDate,
      status,
      points,
      reward,
      endDate,
      internalCollections,
      externalCollections,
      boostsSetAt,
      boostsSetPer,
      game,
      dynamicExplanation
    };
    try {
      const eTActor = await createActor(eTId, eTIDLFactory);
      const tournamentRes = await eTActor.updateTournament(tournament, tournamentId);
      
      if ("ok" in tournamentRes) {
        setLoading(false);
        navigate('/tournaments');
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
        loading ?
          <Backdrop
            sx={{ color: '#000', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        :
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={8} style={{marginTop: "10vh"}}>
            <Paper elevation={3} style={{ width: '100%', marginTop: 10, height: 525, padding: 30 }}>
              <Grid container spacing={2} style={{ width: '100%', height: "100%", position: "relative" }}>
                <Grid item container xs={12} spacing={3} style={{ padding: 50}}>
                  <Grid item xs={3}>
                    <TextField id="input-with-sx" label="Name" variant="outlined" value={name} fullWidth onChange={(e)=>{setName(e.target.value)}} />
                  </Grid>
                  <Grid item xs={3}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Game</InputLabel>
                      <Select
                        labelId="game-select-label"
                        id="game-select"
                        value={game}
                        label="Game"
                        onChange={gameHandleChange}
                      >
                        <MenuItem value={"Bounty Rush"}>Bounty Rush</MenuItem>
                        <MenuItem value={"Elementum TCG"}>Elementum TCG</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker
                        label="Start Date"
                        inputFormat="DD/MM/YYYY"
                        value={startDate}
                        onChange={(e)=>{setStartDate(e)}}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={3}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker
                        label="End Date"
                        inputFormat="DD/MM/YYYY"
                        value={endDate}
                        onChange={(e)=>{setEndDate(e)}}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={3}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Internal Collections</InputLabel>
                      <Select
                        labelId="icoll-select-label"
                        id="icoll-select"
                        value={internalCollections}
                        defaultValue=""
                        input={<OutlinedInput label="Tag" />}
                        renderValue={(selected) => {
                          const sArray = selected.map((s)=>{
                            return s.name;
                          });
                          return String(sArray);
                        }}
                        multiple
                        MenuProps={MenuProps}
                        label="Internal Collections"
                        onChange={(e, i)=> {internalCollHandleChange(e, i)}}
                      >
                        {
                          internalCollectionsArr.length > 0 &&
                          internalCollectionsArr.map((option)=>(
                            <MenuItem value={{id: option.collectionId, name: option.name}}>
                            <Checkbox checked={internalCollections.map(c=>c.id).indexOf(option.collectionId) > -1} />
                              <ListItemText primary={option.name} />
                            </MenuItem>
                        ))
                        }
                        <MenuItem value=""></MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">External Collections</InputLabel>
                      <Select
                        labelId="ecoll-select-label"
                        id="ecoll-select"
                        value={externalCollections}
                        defaultValue=""
                        input={<OutlinedInput label="Tag" />}
                        renderValue={(selected) => {
                          const sArray = selected.map((s)=>{
                            return s.name;
                          });
                          return String(sArray);
                        }}
                        multiple
                        MenuProps={MenuProps}
                        label="External Collections"
                        onChange={(e, i)=> {externalCollHandleChange(e, i)}}
                      >
                        {
                          externalCollectionsArr.length > 0 &&
                          externalCollectionsArr.map((option)=>(
                            <MenuItem value={{id: option.collectionId, name: option.name}}>
                              <Checkbox checked={externalCollections.map(c=>c.id).indexOf(option.collectionId) > -1} />
                              <ListItemText primary={option.name} />
                            </MenuItem>
                        ))
                        }
                        <MenuItem value=""></MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <FormControl fullWidth>
                      <InputLabel id="boostsSetAt-simple-select-label">Boosts Set At</InputLabel>
                      <Select
                        labelId="boostsSetAt-select-label"
                        id="boostsSetAt-select"
                        value={boostsSetAt}
                        defaultValue=""
                        label="Boosts Set At"
                        onChange={boostsSetAtHandleChange}
                      >
                        {
                          boostsSetAtArr.length > 0 &&
                          boostsSetAtArr.map((option)=>{
                            if (externalCollections.length > 1) {
                              if (option.id == "afterResults") {
                                return (
                                  <MenuItem value={option.id}>{option.name}</MenuItem>
                                );
                              };
                            } else {
                                return (
                                  <MenuItem value={option.id}>{option.name}</MenuItem>
                                );
                            };
                          })
                        }
                        <MenuItem value=""></MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <FormControl fullWidth>
                      <InputLabel id="boostsSetPer-simple-select-label">Boosts Set Per</InputLabel>
                      <Select
                        labelId="boostsSetPer-select-label"
                        id="boostsSetPer-select"
                        value={boostsSetPer}
                        defaultValue=""
                        label="Boosts Set Per"
                        onChange={boostsSetPerHandleChange}
                      >
                        {
                          boostsSetPerArr.length > 0 &&
                          boostsSetPerArr.map((option)=>{

                            if(externalCollections.length == 1) {
                              if (option.id != "multiCollComboPoints") {
                                return (
                                  <MenuItem value={option.id}>{option.name}</MenuItem>
                                );
                              };
                            } else if (externalCollections.length > 1) {
                              if (option.id == "multiCollComboPoints") {
                                return (
                                  <MenuItem value={option.id}>{option.name}</MenuItem>
                                );
                              };
                            };
                          })
                        }
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <TextField label="Points" variant="outlined" value={points} inputProps={{type : 'number'}} onChange={(e)=>{setPoints(parseInt(e.target.value))}} />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField id="input-with-sx" label="Reward" variant="outlined" value={reward} onChange={(e)=>{setReward(e.target.value)}} />
                  </Grid>
                  <Grid item xs={3}>
                  <FormControl fullWidth>
                      <InputLabel id="status-simple-select-label">Status</InputLabel>
                      <Select
                        labelId="status-select-label"
                        id="status-select"
                        value={status}
                        defaultValue=""
                        label="Status"
                        onChange={handleChangeStatus}
                      >
                        {
                          statusArr.map((e) => (
                            <MenuItem value={JSON.stringify(e.variant)}>{e.name}</MenuItem>
                          ))
                        }
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField id="input-with-sx" label="Description" variant="outlined" value={description} fullWidth multiline rows={3} onChange={(e)=>{setDescription(e.target.value)}} />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField id="input-with-sx" label="Dynamics details" variant="outlined" value={dynamicExplanation} fullWidth multiline rows={3} onChange={(e)=>{setDynamicExplanation(e.target.value)}} />
                  </Grid>
                </Grid>
                <Grid item style={{ position: "absolute", bottom: 0, right: 0 }}>
                    <Button 
                        variant="contained"
                        onClick={(e)=>{
                          !id ?
                          addNewTournament() :
                          updateTournament(e, id)
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
      }
    </div>
  );
};