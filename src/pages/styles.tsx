import bg_light from '../assets/images/bg_light.png';
import bg_dark from '../assets/images/bg_dark.png';
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(() => ({
  boxBackgroundLogin: {
    display: 'flex',
    height: '100vh',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: `url(${bg_dark})`,
    backgroundRepeat: 'repeat',
  },
  boxLogoLogin: {
    position: 'absolute',
    alignItems: 'center',
    marginTop: '-100px',
  },
  boxButtonLogin: {
    position: 'absolute',
    marginTop: '300px',
    alignItems: 'center',
  },
}));

export default useStyles;

