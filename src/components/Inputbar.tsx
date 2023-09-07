import { Box, IconButton, Menu, MenuItem, TextField } from '@mui/material'
import SendIcon from "@mui/icons-material/Send";
import { makeStyles } from '@mui/styles';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import AddIcon from '@mui/icons-material/Add';
import MicIcon from '@mui/icons-material/Mic';
import { useEffect, useState } from 'react';
import { addDoc, collection, serverTimestamp } from '@firebase/firestore';
import useStore from '../context/store';
import { db } from '../api/Config/firebase';

export default function Inputbar() {
    const classes = useStyles()
    const [message, setMessage] = useState('')
    const [openMore, setOpenMore] = useState<null | HTMLElement>(null); // Estado menu 'more' del input.
    const [conversationMessageRef, setConversationMessageRef]: any = useState() // Guarda ref para enviar mensajes a la conversacion correcta
    const { currentConversation, currentUser }: any = useStore()


    const handleChange = (event: any) => {
        setMessage(event.target.value)
    }

    const handleMore = (event: React.MouseEvent<HTMLElement>) => {
        setOpenMore(event.currentTarget); // Abre el menu more, +.
    };

    const handleCloseMore = () => {
        setOpenMore(null); // Cierra el menu 'more'.
    };

    useEffect(() => {
        // la ref de la conversacion donde enviar los mensajes.
        if (currentConversation) {
            const conversationMessagesRef = collection(
                db,
                "conversations",
                currentConversation?.id,
                "messages"
            );
            setConversationMessageRef(conversationMessagesRef)
        }

    }, [currentConversation])

    console.log({ currentUser })

    const handleSubmitMessage = () => {
        const messageData = {
            content: {
                text: message,
            },
            sendAt: serverTimestamp(),
            sendBy: currentUser?.uid,
            avatar: currentUser?.avatar,
            user: currentUser?.displayName,
            type: 'text'
        };
        addDoc(conversationMessageRef, messageData);
        setMessage('') // Despues de enviar el mensaje, borra el estado.
    };


    return (
        <Box className={classes.container}>
            <Box className={classes.iconsAndMore}>
                <IconButton>
                    <InsertEmoticonIcon />
                </IconButton>
                <IconButton onClick={handleMore}>
                    <AddIcon />
                </IconButton>
                <Menu
                    id="menu-more"
                    anchorEl={openMore}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(openMore)}
                    onClose={handleCloseMore}
                >
                    <MenuItem onClick={handleCloseMore}>Camara</MenuItem>
                    <MenuItem onClick={handleCloseMore}>Send photo</MenuItem>
                </Menu>
            </Box>
            <TextField size='small' value={message} className={classes.input} onChange={handleChange} />
            <Box className={classes.sendAndAudio}>
                {message.length ?
                    <IconButton onClick={handleSubmitMessage}>
                        <SendIcon />
                    </IconButton> :
                    <IconButton>
                        <MicIcon />
                    </IconButton>
                }
            </Box>
        </Box>
    )
}


const useStyles = makeStyles(() => ({
    container: {
        display: 'grid',
        gridTemplateColumns: '1fr 80% 1fr',
        backgroundColor: "#A8CF45",
        alignContent: 'center'
    },
    iconsAndMore: {
        display: 'flex',
        justifyContent: 'center'
    },
    input: {
    },
    sendAndAudio: {
        display: 'flex',
        justifyContent: 'center'
    }
}));
