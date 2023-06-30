import React, { useState, useEffect, useContext } from 'react';
import Button from '@mui/material/Button';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';

import { UserAuth } from '../context/AuthContext';
import { Avatar, Box } from '@mui/material';


export default function Profile({onClose}:any) {

  const { user } = UserAuth()
  const handleClose = () => {
    onClose(false);
  };

  return (
    <Box>
        <AppBar sx={{ position: 'relative', backgroundColor: '#A8CF45'}}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Profile
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              save
            </Button>
          </Toolbar>
        </AppBar>
        <List>
          <ListItem>
          <Avatar title={user?.displayName} src={user?.photoURL} 
  style={{ width: '120px', height: '120px' }} />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary="Nombre" secondary={user?.displayName}  />
          </ListItem>
          <ListItem>
            <ListItemText primary="Email" secondary={user?.email}  />
          </ListItem>
          <ListItem>
            <ListItemText primary="Id" secondary={user?.uid}  />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary="Country" secondary={'Argentina'}  />
          </ListItem>
          <ListItem>
            <ListItemText primary="Language" secondary={'Spanish'}  />
          </ListItem>
          <Divider />
        </List>
    </Box>
  );
}
