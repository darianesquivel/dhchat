import { Box, Typography } from '@mui/material';
import SelectChatImg from '../assets/images/select_chat.svg';
import { makeStyles } from '@mui/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function SelectChat() {
    const classes = useStyles();

    return (
        <Box className={classes.container}>
            <Box className={classes.arrowAndText}>
                <ArrowBackIcon className={classes.arrowIcon} />
                <Typography>  Select a chat</Typography>
            </Box>
            <img src={SelectChatImg} alt="Select Chat" width={460} />
        </Box>
    );
}

const useStyles = makeStyles(() => ({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
    },
    arrowAndText: {
        display: 'flex',
        gap: 10,
    },
    arrowIcon: {
        animation: '$moveLeftAndBack 1s linear infinite', // Configura la animación aquí
    },
    '@keyframes moveLeftAndBack': {
        '0%': {
            transform: 'translateX(0)',
        },
        '50%': {
            transform: 'translateX(-10px)', // Define el movimiento hacia la izquierda aquí
        },
        '100%': {
            transform: 'translateX(0)',
        },
    },
}));