import * as React from 'react';

import Box from '@mui/material/Box';



import CssBaseline from '@mui/material/CssBaseline';
import Home from './Home';
import { TransitionProps } from '@mui/material/transitions';
import { Dialog, Slide } from '@mui/material';
import Profile from './Profile';


const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CustomDrawer() {

  const [openProfile, setOpenProfie] = React.useState(false);

  const handleCloseProfile = () => {
    setOpenProfie(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Box component="main" sx={{ flexGrow: 1, p: 1, backgroundColor: "#f1f1f1" }}>
        <Home />
        <Dialog
          open={openProfile}
          TransitionComponent={Transition}
        >
          <Profile onClose={handleCloseProfile} />
        </Dialog>
      </Box>
    </Box>
  );
}
