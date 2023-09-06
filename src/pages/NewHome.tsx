import { makeStyles } from '@mui/styles'
import Sidebar from '../components/Sidebar';
import { Box } from '@mui/material';
import Conversation from '../components/Conversation';
import useStore from '../context/store';
import { UserAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { getDocs } from '@firebase/firestore';
import { db } from '../api/Config/firebase';
import { collection, } from '@firebase/firestore';


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
    console.log('RENDER DE NEW HOME')
    const classes = useStyles()
    const { user } = UserAuth()
    const { setCurrentUser, setAllUsers }: any = useStore()

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'users'));
                const userData: any = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // El usuario actual logeado, pero con la info de firestore, config personalizada.
                const filteredUser = userData.filter((u: any) => u.email === user?.email);
                setCurrentUser(filteredUser[0]);

                // Todos los usuarios menos el logeado, para mostrar y armar otras conversaciones o grupos.
                const filteredUsers = userData.filter((u: any) => u.email === user?.email);
                setAllUsers(filteredUsers)

            } catch (error) {
                console.error(error);
            }
        };
        return () => {
            fetchUser()
        };
    }, [setAllUsers, setCurrentUser, user])





    return (
        <Box className={classes.container}>
            <Sidebar />
            <Conversation />
        </Box>
    )
}
