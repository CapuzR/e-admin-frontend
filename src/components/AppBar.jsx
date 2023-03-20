import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Grid from '@mui/material/Grid';
import { useState } from 'react';
import EList from './Drawer.jsx';
import { useNavigate } from "react-router-dom";


export default function EAppBar(props) {
    const [ open, setOpen ] = useState(false);
    const navigate = useNavigate();
    
    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

  return (
    <>
        <Box sx={{ flexGrow: 1 }}>
        <AppBar sx={{ backgroundColor: "#222"}} position="static">
            <Toolbar>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={toggleDrawer(true)}
            >
                <MenuIcon />
            </IconButton>
            <EList open={open} toggleDrawer={toggleDrawer}/>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Elementum Admin
            </Typography>
            <Button color="inherit" target="_blank" href="https://aijuw-iyaaa-aaaan-qagfa-cai.ic0.app/">BR Staging</Button>
            <Button color="inherit" target="_blank" href="https://oisnv-xiaaa-aaaan-qaumq-cai.ic0.app/">BR Game</Button>
            </Toolbar>
        </AppBar>
        </Box>
        {
            props.location &&
            <Grid container style={{position: "absolute", left: 100, top: 90, width: 500}}>
                <Grid item>
                    <IconButton onClick={()=>{navigate(-1)}} aria-label="delete">
                        <ArrowBackIcon />
                    </IconButton>
                </Grid>
                <Grid item>
                    <Typography variant="h4">{props.location}</Typography>
                </Grid>
            </Grid>
        }
    </>
  );
}
