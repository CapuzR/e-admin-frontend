import * as React from 'react';
import { useEffect, useState } from 'react';
import { Grid, Button} from '@mui/material';
import { Typography } from "@mui/material";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useParams } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';

import DeleteIcon from '@mui/icons-material/Delete';

import canisters from '../../canister_ids.json';
import { idlFactory as eAIdlFactory } from '../IDLs/e-asset-manager/e_asset_manager.did.js';


const eAId = 
process.env.NODE_ENV == "development" 
? canisters.e_asset_manager.local 
: process.env.NODE_ENV == "staging" 
? canisters.e_asset_manager.staging 
: canisters.e_asset_manager.ic;

const host =
process.env.NODE_ENV == "development"
  ? "http://localhost:4943"
  : process.env.NODE_ENV == "staging"
  ? "https://icp0.io"
  : "https://icp0.io";
  
const whitelist = [];

export default function Cards() {
  const [ connected, setConnected ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const [selectionModel, setSelectionModel] = useState([]);
  const { id } = useParams();
  const [ cards, setCards ] = useState([]);
  const [snackbar, setSnackbar] = React.useState(null);

  const handleCloseSnackbar = () => setSnackbar(null);

  const createActor = async (canisterId, idl)=> { 
    return await window.ic.plug.createActor({
      canisterId,
      interfaceFactory: idl,
    })
  };

  const getCards = async ()=> {
    try {
      const bRAMActor = await createActor(eAId, eAIdlFactory);
      const cardCollectionRes = await bRAMActor.getCardCollection(id);
      if ("ok" in cardCollectionRes) {
        console.log("CardCollection", cardCollectionRes);
        let cardsArr = [];
        cardCollectionRes.ok.cards.map((card)=>{
          cardsArr.push({
              id : card.id,
              index : parseInt(card.index),
              luck : typeof card.luck == "object" && card.luck.length > 0 ? parseInt(card.luck[0]) : "",
              url : card.url,
              thumbnail : card.thumbnail,
              collectionName : cardCollectionRes.ok.name,
              collectionId : cardCollectionRes.ok.collectionId,
              mimeType : card.mimeType,
              action : typeof card.action == "object" && card.action.length > 0 ? card.action[0] : "",
              target : typeof card.target == "object" && card.target.length > 0 ? card.target[0] : "",
              amount : typeof card.amount == "object" && card.amount.length > 0 ? parseInt(card.amount[0]) : "",
          });
        });
        setCards(cardsArr);
        setLoading(false);
      } else {
        window.alert("Error. Please try again and report it.");
      };
    } catch (e) {
      window.alert("Unexpected error. Please try again and report it.");
    };
  };
  
  const deleteCard = async ()=> {
    try {
      setLoading(true);
      const bRAMActor = await createActor(eAId, eAIdlFactory);
      const cardRes = await bRAMActor.deleteCard(selectionModel[0]);

      if ("ok" in cardRes) {
        location.reload();
      } else {
        window.alert("Fail. Try again and report it.");
      };
    } catch (e) {
      window.alert("Unexpected error. Please try again and report it.");
    };
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
    setLoading(true);
    verifyConnectionAndAgent();
    getCards();
  }, []);

  const columns = [
    { field: 'index', headerName: 'Index', width: 60, headerAlign: 'center' },
    {
      field: "thumbnail",
      headerName: "Thumbnail", 
      headerAlign: 'center',
      width: 100,
      renderCell: (params) => {
        return (
          <>
            <img src={params.row.thumbnail} style={{height: "100%"}} />
          </>
        );
      }
    },
    { field: 'luck', headerName: 'Luck', width: 50, headerAlign: 'center', editable: true },
    { field: 'target', headerName: 'Target', width: 100, headerAlign: 'center', editable: true },
    { field: 'action', headerName: 'Action', width: 80, headerAlign: 'center', editable: true },
    { field: 'amount', headerName: 'Amount', width: 70, headerAlign: 'center', editable: true },
    { field: 'id', headerName: 'ID', width: 100, headerAlign: 'center' },
    { field: 'url', headerName: 'URL', width: 300, headerAlign: 'center' },
    { field: 'mimeType', headerName: 'Mime type', width: 100, headerAlign: 'center' },
  ];

  const handleProcessRowUpdateError = React.useCallback((error) => {
    setSnackbar({ children: error.message, severity: 'error' });
  }, []);

  const processRowUpdate = async (newRow)=> {
    try {
      setLoading(true);

      const updatedCard = {
        id : newRow.id,
        index : parseInt(newRow.index),
        luck :  newRow.luck ? [parseInt(newRow.luck)] : [],
        url : newRow.url,
        thumbnail : newRow.thumbnail,
        collectionName : newRow.collectionName,
        collectionId : newRow.collectionId,
        mimeType : newRow.mimeType,
        action : newRow.action ? [newRow.action] : [],
        target : newRow.target ? [newRow.target] : [],
        amount : newRow.amount ? [parseInt(newRow.amount)] : [],
      };
      const bRAMActor = await createActor(eAId, eAIdlFactory);
      const cardRes = await bRAMActor.updateCard(updatedCard);


      if ("ok" in cardRes) {
        setLoading(false);
        return newRow;
      } else {
        window.alert("Fail. Try again and report it.");
      };
    } catch (e) {
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
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={8} style={{marginTop: "7vh"}}>
            {
                selectionModel.length != 0 &&
                <Grid container spacing={2} style={{ width: '60%', marginTop: 10 }}>
                    {
                      selectionModel.length == 1 &&
                      <>
                        <Grid item>
                            <Button onClick={()=>{
                                deleteCard();
                            }}>
                              <DeleteIcon/>
                            </Button>
                        </Grid>
                      </>
                    }
              </Grid>
            }
          <Grid container spacing={2} style={{ height: 500, width: '100%', marginTop: 20 }}>
            <DataGrid
                rows={cards}
                columns={columns}
                pageSize={7}
                rowsPerPageOptions={[7]}
                checkboxSelection
                onSelectionModelChange={setSelectionModel}
                selectionModel={selectionModel}
                disableSelectionOnClick
                experimentalFeatures={{ newEditingApi: true }}
                processRowUpdate={processRowUpdate}
                onProcessRowUpdateError={handleProcessRowUpdateError}
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
      {!!snackbar && (
        <Snackbar
          open
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          onClose={handleCloseSnackbar}
          autoHideDuration={6000}
        >
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
    </div>
  );
};