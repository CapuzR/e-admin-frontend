import * as React from 'react';
import { useEffect, useState } from 'react';
import { Grid, Button, Typography, CircularProgress, Backdrop, Tooltip } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';
import canisters from '../../canister_ids.json';
import { idlFactory as eTIdlFactory } from '../IDLs/e-tournament-manager/e_tournament_manager.did.js';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';

const eTId = process.env.NODE_ENV == "development" ? canisters.e_tournament_manager.local : process.env.NODE_ENV == "staging" ? canisters.e_tournament_manager.staging : canisters.e_tournament_manager.ic;

const host =
process.env.NODE_ENV == "development"
  ? "http://localhost:4943"
  : process.env.NODE_ENV == "staging"
  ? "https://icp0.io"
  : "https://icp0.io";
  
const whitelist = [ eTId ];

export default function Tournaments() {
  
  const navigate = useNavigate();
  const [ connected, setConnected ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const [selectionModel, setSelectionModel] = useState([]);
  const [ tournaments, setTournaments ] = useState([]);

  const createActor = async (id, idl)=> { 
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

  const getTournaments = async ()=> {
    try {
      console.log("gT");
      console.log("eTId", eTId);
      const eTActor = await createActor(eTId, eTIdlFactory);
      console.log("eTActor", eTActor);
      const tournamentsRes = await eTActor.getAllTournaments();
      console.log("tournamentsRes", tournamentsRes);

      if ("ok" in tournamentsRes) {
        let tournaments = tournamentsRes.ok;
        setTournaments(tournaments);
      } else {
        window.alert("Error. Please try again and report it.");
      };
    } catch (e) {
      console.log(e);
      window.alert("Unexpected error. Please try again and report it.");
    };
  };

  const deleteTournament = async ()=> {
    try {
      const bRAMActor = await createActor(eTId, eTIdlFactory);
      const tournaments = await bRAMActor.deleteTournament(selectionModel[0]);
      if ("ok" in tournaments) {
        location.reload();
      } else {
        window.alert("Fail. Try again and report it.");
      };
    } catch (e) {
      window.alert("Unexpected error. Please try again and report it.");
    };
  };
  
  const closeTournament = async ()=> {
    try {
      const bRAMActor = await createActor(eTId, eTIdlFactory);
      const tournaments = await bRAMActor.endTournament(selectionModel[0]);
      if ("ok" in tournaments) {
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
    getTournaments();
    setLoading(false);
  }, []);

const columns = [
    { field: 'id', headerName: 'ID', width: 230 },
    { field: 'name', headerName: 'Name', width: 170 },
    { field: 'description', headerName: 'Description', width: 240 },
    { field: 'startDate', headerName: 'Start Date', width: 120 },
    { field: 'endDate', headerName: 'End Date', width: 120 },
    { 
      field: 'internalCollections', 
      headerName: 'Internal Collections', 
      width: 120,
      valueGetter: (params) => {
        let iColls = "";
        if (params.row.internalCollections.length == 1) {
          iColls = iColls.concat(params.row.internalCollections[0].name);
        } else {
          params.row.internalCollections.map((iColl, i)=>{
            if(i == 0) {
              iColls = iColls.concat(iColl.name).concat(", ");
            } else {
              iColls = iColls.concat(iColl.name);
            };
          });
        };
        
        return iColls;
      },
      renderCell: (params) =>  {

        let iColls = "";
        if (params.row.internalCollections.length == 1) {
          iColls = iColls.concat(params.row.internalCollections[0].name);
        } else {
          params.row.internalCollections.map((iColl, i)=>{
            if(i == 0) {
              iColls = iColls.concat(iColl.name).concat(", ");
            } else {
              iColls = iColls.concat(iColl.name);
            };
          });
        };

        return(
         <Tooltip title={iColls} >
          <span className="table-cell-trucate">{iColls}</span>
          </Tooltip>
        );
      },
    },
    { 
      field: 'externalCollections', 
      headerName: 'External Collections', 
      width: 120,
      valueGetter: (params) => {
        let eColls = "";
        if (params.row.externalCollections.length == 1) {
          eColls = eColls.concat(params.row.externalCollections[0].name);
        } else {
          params.row.externalCollections.map((eColl, i)=>{
            if(i == 0) {
              eColls = eColls.concat(eColl.name).concat(", ");
            } else {
              eColls = eColls.concat(eColl.name);
            };
          });
        };
        
        return eColls;
      },
      renderCell: (params) =>  {
        let eColls = "";
        if (params.row.externalCollections.length == 1) {
          eColls = eColls.concat(params.row.externalCollections[0].name);
        } else {
          params.row.externalCollections.map((eColl, i)=>{
            if(i == 0) {
              eColls = eColls.concat(eColl.name).concat(", ");
            } else {
              eColls = eColls.concat(eColl.name);
            };
          });
        };

        return(
         <Tooltip title={eColls} >
          <span className="table-cell-trucate">{eColls}</span>
          </Tooltip>
        );
      },
    },
    { field: 'boostsSetAt', headerName: 'Boosts set at', width: 120 },
    { field: 'boostsSetPer', headerName: 'Boosts set per', width: 120 },
    { field: 'game', headerName: 'Game', width: 240 },
    { field: 'dynamicExplanation', headerName: 'Explanation', width: 100 },
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
                <Grid item>
                    <Button
                        variant="contained"
                        onClick={()=>{
                            navigate(`/tournament/new`);
                        }
                    }>
                        Add New Tournament
                    </Button>
                </Grid>
            </Grid>
            {
                selectionModel.length != 0 &&
                <Grid container spacing={2} justifyContent="start" style={{ width: '100%' }}>
                    <Grid item>
                        <Button onClick={()=>{
                            setSelectionModel(!selectionModel)
                            navigate(`/tournament/${selectionModel[0]}/update`);
                        }}>
                            <EditIcon/>
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button onClick={()=>{
                            deleteTournament();
                        }}>
                            <DeleteIcon/>
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button onClick={()=>{
                            closeTournament();
                        }}>
                            <CloseIcon/>
                        </Button>
                    </Grid>
              </Grid>
            }
          <Grid container spacing={2} style={{ height: 500, width: '100%', marginTop: 10 }}>
            <DataGrid
                rows={tournaments}
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