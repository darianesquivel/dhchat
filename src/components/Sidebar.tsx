import { makeStyles } from "@mui/styles";
import {
    Avatar,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React, { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../api/Config/firebase";
import Chat from "./Chat";
import useStore from "../context/store";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import LogoutIcon from "@mui/icons-material/Logout";
import CustomDrawer from "../pages/CustomDrawer";

export default function Sidebar() {
    const classes = useStyles();
    const {
        setMessages,
        conversations,
        setConversations,
        setCurrentConversation,
        currentUser,
    }: any = useStore(); // Global states
    const [openMore, setOpenMore] = useState<null | HTMLElement>(null); // State menu 'more' del sidebar header.
    const [openDrawer, setOpenDrawer] = useState(false); // State menu 'more' del sidebar header.

    const { logOut, user } = UserAuth(); // LogOut y usuario logeado.

    const conversationsRef = collection(db, "conversations"); // Ref de conversaciones firestore.

    useEffect(() => {
        const getConversations = onSnapshot(
            query(conversationsRef, orderBy("createAt", "desc")),
            (snapshot) => {
                let conversations: any = [];
                snapshot.forEach((doc) => {
                    //trae todas las conversaciones que sean abiertas y las del usuario logeado.
                    if (
                        doc.data().participants?.includes(user?.email) ||
                        doc.data().participants?.includes("open-group")
                    ) {
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
        const conversationMessagesRef = collection(
            db,
            "conversations",
            conversation.id,
            "messages"
        );

        setCurrentConversation(conversation);
        const queryMessages = query(conversationMessagesRef, orderBy("sendAt"));

        onSnapshot(queryMessages, (snapshot) => {
            let messages: any = [];
            snapshot.forEach((doc) => {
                messages.push({ ...doc.data(), id: doc.id });
            });
            setMessages(messages); // Setea en el estado global los mensajes de la conversacion clickeada para mostrarlos en otro componente.
        });
    };

    const toggleDrawer = () => {
        setOpenDrawer(!openDrawer);
    }

    return (
        <Box className={classes.container}>
            <Box className={classes.sidebarHeader}>
                <Avatar onClick={toggleDrawer} src={currentUser?.avatar} className={classes.avatar} />
                <IconButton onClick={handleMenu}>
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={openMore}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                    open={Boolean(openMore)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleClose}>
                        <ManageAccountsIcon />
                        <Typography>Profile</Typography>
                    </MenuItem>
                    <MenuItem onClick={logOut}>
                        <LogoutIcon />
                        <Typography>Log out</Typography>
                    </MenuItem>
                </Menu>
            </Box>
            <Box className={classes.sidebarContainer}>
                {conversations?.map((conversation: any, key: any) => {
                    const { lastMessage, avatar, name, id, lastMessageSendBy } =
                        conversation;
                    return (
                        <Chat
                            key={key}
                            lastMessage={lastMessage}
                            lastMessageSendBy={lastMessageSendBy}
                            avatar={avatar}
                            name={name}
                            id={id}
                            onClick={() => handleClickConversation(conversation)}
                        />
                    );
                })}
            </Box>
            <CustomDrawer className={classes.drawerContainer} openDrawer={openDrawer} toggleDrawer={toggleDrawer} />
        </Box>
    );
}

const useStyles = makeStyles(() => ({
    container: {
        display: "grid",
        gridTemplateRows: "70px 1fr",
        backgroundColor: "white",
    },
    sidebarHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#A8CF45",
        padding: 8,
    },
    sidebarContainer: {
        display: 'flex',
        flexDirection: "column",
        gap: 5,
        maxHeight: "calc(100vh - 80px)",
        overflowY: "auto",
        padding: 8,

    },
    drawerContainer: {
        display: 'flex',
        width: '100%',
        marginLeft: '8px'
    },
    avatar: {
        cursor: 'pointer'
    }
}));
