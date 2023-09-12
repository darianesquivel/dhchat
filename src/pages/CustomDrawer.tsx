import { Drawer } from '@mui/material';
import Profile from './Profile';
import { makeStyles } from "@mui/styles";

export default function CustomDrawer({ openDrawer, toggleDrawer }: any) {
  const classes = useStyles()

  return (
    <Drawer
      anchor={'left'}
      open={openDrawer}
      onClose={toggleDrawer}
      BackdropProps={{
        invisible: true, // Desactiva el fondo oscurecido
      }}
      className={classes.drawerContainer}
      PaperProps={{
        style: {
          width: 'calc(25% - 4px)', // Ancho del Drawer con margen de 8px
          height: 'calc(100vh - 10px)',
          marginLeft: '8px', // Margen izquierdo de 8px
          marginTop: '8px', // Margen izquierdo de 8px
          boxShadow: 'none',
        },
      }}
    >
      <Profile onClose={toggleDrawer} />
    </Drawer >
  );
}

const useStyles = makeStyles(() => ({
  drawerContainer: {
    position: 'relative',
    width: "500px"
  }
}));
