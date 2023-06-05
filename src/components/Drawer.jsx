import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate } from "react-router-dom";

export default function EList(props) {
    const navigate = useNavigate();

    return (
        <Drawer
            anchor="left"
            open={props.open}
            onClose={props.toggleDrawer(false)}
        >
        <Box
        role="presentation"
        onClick={props.toggleDrawer(!props.open)}
        onKeyDown={props.toggleDrawer(!props.open)}
        >
        <List>
            {[{title: 'NFT Collections', url: '/collections', active: true}, 
            {title: 'Tournaments', url: '/tournaments', active: true},
            {title: 'Allow List', url: '/allow-list', active: true}]
            .map((object, index) => {
                    if(object.active){
                        return (
                            <ListItem key={object.title} disablePadding>
                                <ListItemButton onClick={()=>{navigate(object.url)}}>
                                <ListItemText primary={object.title} />
                                </ListItemButton>
                            </ListItem>
                        );
                    };
            })}
        </List>
        <Divider />
        <List>
            {[{title: 'Bounty Rush Settings', url: '/collections', active: false}, 
            {title: 'Logger Settings', url: '/collections', active: false}, 
            {title: 'Spam Settings', url: '/collections', active: false}]
            .map((object, index) => {
                if(object.active){
                    return (
                        <ListItem key={object.title} disablePadding>
                            <ListItemButton onClick={()=>{navigate(object.url)}}>
                            <ListItemText primary={object.title} />
                            </ListItemButton>
                        </ListItem>
                    );
                };
        })}
        </List>
        </Box>
        </Drawer>
    );
};

