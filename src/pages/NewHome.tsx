import { makeStyles } from '@mui/styles'
import Sidebar from '../components/Sidebar';
import { Box } from '@mui/material';
import Conversation from '../components/Conversation';

const useStyles = makeStyles(() => ({
    container: {
        height: '100vh',
        display: 'grid',
        gridTemplateColumns: '25% 1fr',
        backgroundColor: '#F1F1F1',
        gap: 2,
        padding: 8,
    },
}));

export default function NewHome() {
    const classes = useStyles()
    console.log('RENDER DE NEW HOME')

    return (
        <Box className={classes.container}>
            <Sidebar />
            <Conversation />
        </Box>
    )
}
