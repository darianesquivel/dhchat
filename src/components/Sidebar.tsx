import { makeStyles } from '@mui/styles'
import { Avatar, Box, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React, { useEffect, useState } from 'react';
import { UserAuth } from '../context/AuthContext';
import {
    collection,
    query,
    onSnapshot,
    orderBy,
} from "firebase/firestore";
import { db } from "../api/Config/firebase";
import Chat from './Chat';
import useStore from '../context/store';


export default function Sidebar() {
    console.log('RENDER DE SIDEBAR')
    const classes = useStyles()
    const { setMessages, conversations, setConversations, setCurrentConversation }: any = useStore() // Global states
    const [openMore, setOpenMore] = useState<null | HTMLElement>(null); // State menu 'more' del sidebar header.

    const { logOut, user } = UserAuth() // LogOut y usuario logeado.


    const conversationsRef = collection(db, "conversations"); // Ref de conversaciones firestore.

    useEffect(() => {
        const getConversations = onSnapshot(
            query(conversationsRef, orderBy("createAt", "desc")),
            (snapshot) => {
                let conversations: any = [];
                snapshot.forEach((doc) => {
                    //trae todas las conversaciones que sean abiertas y las del usuario logeado.
                    if (doc.data().participants?.includes(user?.email) || doc.data().participants?.includes("open-group")) {
                        conversations.push({ ...doc.data(), id: doc.id });
                    }
                });
                setConversations(conversations);
            }
        );
        return () => {
            getConversations();

        };
        // eslint-disable-next-line
    }, []);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setOpenMore(event.currentTarget); // Abre el menu more, con los 3 puntos.
    };

    const handleClose = () => {
        setOpenMore(null); // Cierra el menu 'more'.
    };

    const handleClickConversation = (conversation: any) => {
        console.log(conversation)
        const conversationMessagesRef = collection(
            db,
            "conversations",
            conversation.id,
            "messages"
        );

        setCurrentConversation(conversation)
        const queryMessages = query(conversationMessagesRef, orderBy("sendAt"));

        onSnapshot(queryMessages, (snapshot) => {
            let messages: any = [];
            snapshot.forEach((doc) => {
                messages.push({ ...doc.data(), id: doc.id });
            });
            setMessages(messages) // Setea en el estado global los mensajes de la conversacion clickeada para mostrarlos en otro componente.
        });
    }


    return (
        <Box className={classes.container}>
            <Box className={classes.sidebarHeader}>
                <Avatar src={user?.photoURL} />
                <IconButton onClick={handleMenu}>
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    id="menu-appbar"
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
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                    <MenuItem onClick={logOut}>Log out</MenuItem>
                </Menu>
            </Box>
            <Box className={classes.sidebarContainer}>
                {conversations?.map((conversation: any, key: any) => {
                    const { lastMessage, avatar, name, id, lastMessageSendBy } =
                        conversation;
                    return (
                        <Box key={key} sx={{ alignItems: 'center', margin: 0.5 }}>
                            <Chat
                                lastMessage={lastMessage}
                                lastMessageSendBy={lastMessageSendBy}
                                avatar={avatar}
                                name={name}
                                id={id}
                                onClick={() => handleClickConversation(conversation)}
                            />
                        </Box>
                    );
                })}
            </Box>
        </Box>
    )
}

const useStyles = makeStyles(() => ({
    container: {
        display: 'grid',
        gridTemplateRows: '60px 1fr',
        backgroundColor: 'white',
    },
    sidebarHeader: {
        display: 'flex',
        justifyContent: "space-between",
        alignItems: 'center',
        backgroundColor: '#A8CF45',
        padding: '8px',
    },
    sidebarContainer: {
        maxHeight: "calc(100vh - 80px)",
        overflowY: "auto",
    }
}));
