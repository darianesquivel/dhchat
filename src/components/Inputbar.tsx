import {
    Box,
    IconButton,
    Menu,
    MenuItem,
    TextField,
    Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { makeStyles } from "@mui/styles";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import AddIcon from "@mui/icons-material/Add";
import MicIcon from "@mui/icons-material/Mic";
import { useEffect, useState } from "react";
import { addDoc, collection, serverTimestamp } from "@firebase/firestore";
import useStore from "../context/store";
import { db } from "../api/Config/firebase";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import Picker from "@emoji-mart/react";


export default function Inputbar() {
    const classes = useStyles();
    const [message, setMessage] = useState("");
    const [openMore, setOpenMore] = useState<null | HTMLElement>(null); // Estado menu 'more' del input.
    const [openEmoji, setOpenEmoji] = useState<null | HTMLElement>(null); // Estado emojis.
    const [conversationMessageRef, setConversationMessageRef]: any = useState(); // Guarda ref para enviar mensajes a la conversacion correcta
    const { currentConversation, currentUser }: any = useStore();

    const handleChange = (event: any) => {
        // if para saber si es un emoji el que ejecuto el handleChange
        if (event.native) {
            setMessage(message + event.native);
        } else {
            // si no es emoji es un mensaje text
            setMessage(event.target.value);
        }
    };

    const handleMore = (event: React.MouseEvent<HTMLElement>) => {
        setOpenMore(event.currentTarget); // Abre el menu more, +.
    };

    const handleCloseMore = () => {
        setOpenMore(null); // Cierra el menu 'more'.
    };

    const handleEmoji = (event: React.MouseEvent<HTMLElement>) => {
        setOpenEmoji(event.currentTarget); // Abre los emojis.
    };

    const handleCloseEmoji = () => {
        setOpenEmoji(null); // Cierra los emojis.
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
            setConversationMessageRef(conversationMessagesRef);
        }
    }, [currentConversation]);


    const handleSubmitMessage = () => {
        const messageData = {
            content: {
                text: message,
            },
            sendAt: serverTimestamp(),
            sendBy: currentUser?.uid,
            avatar: currentUser?.avatar,
            user: currentUser?.displayName,
            type: "text",
        };
        addDoc(conversationMessageRef, messageData);
        setMessage(""); // Despues de enviar el mensaje, borra el estado.
    };

    return (
        <Box className={classes.container}>
            <Box className={classes.iconsAndMore}>
                <IconButton onClick={handleEmoji}>
                    <InsertEmoticonIcon />
                </IconButton>
                <Menu
                    id="menu-emoji"
                    anchorEl={openEmoji}
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                    }}
                    open={Boolean(openEmoji)}
                    onClose={handleCloseEmoji}
                >
                    <Picker
                        theme='light'
                        emojiSize={24}
                        emojiButtonSize={36}
                        onEmojiSelect={handleChange}
                        maxFrequentRows={0}
                    />
                </Menu>
                <IconButton onClick={handleMore}>
                    <AddIcon />
                </IconButton>
                <Menu
                    id="menu-more"
                    anchorEl={openMore}
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                    }}
                    open={Boolean(openMore)}
                    onClose={handleCloseMore}
                >
                    <MenuItem onClick={handleCloseMore}>
                        <CameraAltIcon />
                        <Typography>Camara</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleCloseMore}>
                        <AddPhotoAlternateIcon />
                        <Typography>Send photo</Typography>
                    </MenuItem>
                </Menu>
            </Box>
            <TextField
                size="small"
                value={message}
                className={classes.input}
                onChange={handleChange}
            />
            <Box className={classes.sendAndAudio}>
                {message.length ? (
                    <IconButton onClick={handleSubmitMessage}>
                        <SendIcon />
                    </IconButton>
                ) : (
                    <IconButton>
                        <MicIcon />
                    </IconButton>
                )}
            </Box>
        </Box>
    );
}

const useStyles = makeStyles(() => ({
    container: {
        display: "grid",
        gridTemplateColumns: "1fr 80% 1fr",
        backgroundColor: "#A8CF45",
        alignContent: "center",
    },
    iconsAndMore: {
        display: "flex",
        justifyContent: "center",
    },
    input: {},
    sendAndAudio: {
        display: "flex",
        justifyContent: "center",
    },
}));
