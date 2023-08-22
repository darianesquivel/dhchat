import React from "react";
import { Avatar, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Menu, MenuItem, Slide, TextField, Tooltip, Typography } from "@mui/material";
import { UserAuth } from "../context/AuthContext";
import { createContext, useEffect, useRef, useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  onSnapshot,
  orderBy,
  CollectionReference,
  updateDoc,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../api/Config/firebase";
import Message from "../components/Message";
import SendIcon from "@mui/icons-material/Send";
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import bg_light from "../assets/images/bg_light.png";
import logo from '../assets/images/logo.png'
import Chat from "../components/Chat";
import CustomSelected from "../components/CustomSelect";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import ImageUploader from '../components/ImageUploader';
import AddIcon from '@mui/icons-material/Add';
import ListAvatar from "../components/ListAvatar";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SelectChat from '../assets/images/select_chat.svg'
import Profile from "./Profile";
import { TransitionProps } from "@mui/material/transitions";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChatIcon from '@mui/icons-material/Chat';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';


interface User {
  email: string;
  displayName: string;
  photoURL:string;
  uid:string;
}

  interface AuthContextProps {
  googleSignIn: () => Promise<void>;
  logOut: () => Promise<void>;
  user: User | null;
}

const AuthContext = createContext<AuthContextProps>({
  googleSignIn: async () => {},
  logOut: async () => {},
  user: null,
});

export default function Home() {
  //const { user } = UserAuth();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const conversationsRef = collection(db, "conversations");
  const [conversations, setConversations] = useState([]);
  const [conversation, setConversation] = useState();
  const [conversationId, setConversationId] = useState("");
  const [displayMessages, setDisplayMessages] = useState(false);
  const [lenguage, setLenguage] = useState("en");
  const [translateMe, setTranslateMe] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const formContainerRef = useRef<HTMLDivElement>(null);
  const emojiContainerRef = useRef<HTMLDivElement>(null);

  const toggleShowEmoji = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShowEmoji(!showEmoji);
    setShowImageUpload(false);
  };

  const toggleImageUpload = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShowImageUpload(!showImageUpload);
    setShowEmoji(false);
  };

  const [chatName, setChatName] = useState('')
  const [avatar, setAvatar] = useState('')
  const [users, setUsers] = useState([])
  const [participants, setParticipants] = useState([])
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmitNewChat = async () => {
    const newConversation = {
      name: chatName,
      avatar: avatar,
      createAt: serverTimestamp(),
      participants
    };

    await addDoc(conversationsRef, newConversation);
    setOpen(false);

  }

  // Add emoji
  const addEmoji = (e: { unified: string; }) => {
    const sym = e.unified.split("_");
    const codeArray: string[] = [];
    sym.forEach((el) => codeArray.push("0x" + el));
    const emoji = String.fromCodePoint(...codeArray.map(el => parseInt(el, 16)));
    setNewMessage(newMessage + emoji);
  };

  const [messagesRef, setmessagesRef] = useState<CollectionReference | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        formContainerRef.current &&
        !formContainerRef.current.contains(event.target as Node)
      ) {
        setShowImageUpload(false);
      }
      if (
        emojiContainerRef.current &&
        !emojiContainerRef.current.contains(event.target as Node)
      ) {
        setShowEmoji(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const getConversations = onSnapshot(
      query(conversationsRef, orderBy("createAt", "desc")),
      (snapshot) => {
        let conversations: any = [];
        snapshot.forEach((doc) => {
          if (doc.data().participants?.includes(user?.email) || doc.data().participants?.includes("open-group")) {
            conversations.push({ ...doc.data(), id: doc.id });
          }
        });
        setConversations(conversations);
      }
    );

    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const userData: any = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        const filteredUsers = userData.filter((u: any) => u.email !== user?.email);
        setUsers(filteredUsers);
      } catch (error) {
        console.error(error);
      }
    };

    return () => {
      getConversations();
      fetchUsers()
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleClickConversation = (conversationId: any) => {
    setDisplayMessages(true);
    const conversationMessagesRef = collection(
      db,
      "conversations",
      conversationId,
      "messages"
    );
    const conversationRef = doc(db, "conversations", conversationId);
    setmessagesRef(conversationMessagesRef);
    setConversationId(conversationId);

    const queryMessages = query(conversationMessagesRef, orderBy("sendAt"));

    getDoc(conversationRef)
      .then((docSnapshot) => {
        if (docSnapshot.exists()) {
          const data: any = docSnapshot.data();
          setConversation(data);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    onSnapshot(queryMessages, (snapshot) => {
      let messages: any = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
    });
  };

  const handleSubmit = (messageType = 'text') => {
    try {
      if (newMessage === "") return;
      if (messagesRef) {
        const messageData = {
          content: {
            text: messageType === 'text' ? newMessage : '',
            imageUrl: messageType === 'image' ? newMessage : '',
          },
          sendAt: serverTimestamp(),
          sendBy: user?.uid,
          avatar: user?.photoURL,
          user: user?.displayName,
          type: messageType
        };

        addDoc(messagesRef, messageData);

        const conversationRef = doc(
          collection(db, "conversations"),
          conversationId
        );

        updateDoc(conversationRef, {
          lastMessage: messageType === 'text' ? newMessage : 'image',
          lastMessageSendBy: user?.displayName,
        });

        setNewMessage("");

      }
    } catch (error) {
      console.error(error);
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current && messagesEndRef.current.scrollIntoView) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const [openProfile, setOpenProfile] = React.useState(false);
  
  const { logOut, user } = UserAuth()

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenProfile = () => {
    setOpenProfile(true);
  };

  const handleCloseProfile = () => {
    setOpenProfile(false);
  };

  const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  return (
    <>
      <Box
        sx={{
          height: "98vh",
          display: "flex",
          p: 1,
          gap: 1,
          backgroundColor: "#f1f1f1",
        }}
      >
        <Box
          sx={{
            width: "15%",
            minWidth: "220px",
            borderRadius: 2,
            p: 1,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            backgroundColor: "white",
            alignItems: "center",
          }}
        >
          <Box sx={{ marginTop: 2}}><img width="140px" src={logo} alt="logo"/></Box>
          <Divider orientation="horizontal" flexItem sx={{ marginTop: "10px", marginBottom: "3px" }} />
          <Box>
            <Tooltip title="User menu" placement="right-end">
              <IconButton onClick={handleOpenUserMenu}
                edge="start">
                <Avatar alt={user?.displayName} src={user?.photoURL} />
              </IconButton>
            </Tooltip>
            {user?.displayName}
            <Menu
              sx={{ marginTop: 7, marginLeft: 6 }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={handleOpenProfile}>
                <PersonIcon fontSize="small"  sx={{marginRight: 2, color: "#A8CF45" }}/>
                <Typography textAlign="center">Profile</Typography>
              </MenuItem>
              <MenuItem>
                <SettingsIcon fontSize="small"  sx={{marginRight: 2, color: "#A8CF45" }}/>
                <Typography textAlign="center">Configuration</Typography>
              </MenuItem>
              <MenuItem >
                <Brightness4Icon fontSize="small"  sx={{marginRight: 2, color: "#A8CF45" }}/>
                <Typography textAlign="center">Dark mode</Typography>
              </MenuItem>
              <MenuItem onClick={logOut}>
                <LogoutIcon fontSize="small" sx={{marginRight: 2, color: "#A8CF45" }}/>
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
          {/* <Divider orientation="horizontal" flexItem sx={{ marginTop: "3px", marginBottom: "3px" }} /> */}
        <Accordion defaultExpanded sx={{width:'100%', backgroundColor:'#f8f8f8', marginTop: 0.5, boxShadow: 'none', border: 'none', }} >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="chats-content"
          id="chats-header"
        >
            <ChatIcon sx={{ marginRight: 1, color: "#A8CF45" }}/>
            <Typography variant="button" fontWeight={600}>Chats</Typography>
        </AccordionSummary>
        <AccordionDetails  sx={{padding: 0, fontSize: 13 }}>
        <IconButton onClick={handleClickOpen} sx={{marginLeft: 0.5}}><AddIcon fontSize="small" /></IconButton>Add new chat
        {conversations?.map((conversation: any, key) => {
            const { lastMessage, avatar, name, id, lastMessageSendBy } =
              conversation;
            return (
              <Box sx={{ alignItems: 'center', margin: 0.5 }}>
              <Chat
                key={key}
                lastMessage={lastMessage}
                lastMessageSendBy={lastMessageSendBy}
                avatar={avatar}
                name={name}
                id={id}
                onClick={handleClickConversation}
              />
              </Box>
            );
          })}
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{width:'100%', backgroundColor:'#f8f8f8', boxShadow: 'none', border: 'none', borderTopStyle: 'none'}} >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="contacts-content"
          id="contacts-header"
        >
          <PermContactCalendarIcon sx={{ marginRight: 1, color: "#A8CF45" }}/>
          <Typography variant="button" fontWeight={600}>Contacts</Typography>
        </AccordionSummary>
        <AccordionDetails  sx={{padding: 0, fontSize: 13 }}>
        <IconButton sx={{marginLeft: 0.5}}><AddIcon fontSize="small" /></IconButton>Add new contact
        </AccordionDetails>
      </Accordion>
                {/* <Divider orientation="horizontal" flexItem sx={{ marginBottom: "3px" }} /> */}
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                Add new chat
              </DialogTitle>
              <DialogContent>
                <TextField onChange={(e) => setChatName(e.target.value)} id="outlined-basic" label="Name" variant="outlined" />
                <TextField onChange={(e) => setAvatar(e.target.value)} id="outlined-basic" label="Avatar" variant="outlined" />
                <ListAvatar users={users} onAddParticipants={setParticipants} currentUser={user?.email} />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmitNewChat} autoFocus>
                  Add
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        <Box
          sx={{
            width: "85%",
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundImage: `url(${bg_light})`,
            backgroundSize: "contain",
            backgroundColor: "white",
          }}
        >
          {displayMessages ? (
            <>
              <Box
                sx={{
                  backgroundColor: "#A8CF45",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 0.5,
                  borderRadius: 2,
                  marginBottom: 1,
                }}
              >
                <Box sx={{ display: "flex", gap: 2, p: 0.5 }}>
                  <Avatar src={(conversation as any)?.avatar} variant="rounded" style={{ width: '60px', height: '60px' }} />
                  <Box>
                    <Typography variant="overline" fontWeight={800} color="white">
                      {(conversation as any)?.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {(conversation as any)?.participants.map((e: any) => <Chip sx={{ fontSize: 10 }} size="small" label={e} />)}
                    </Box>


                  </Box>

                </Box>
                <CustomSelected setLenguage={setLenguage} setTranslateMe={setTranslateMe} />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "90%",
                  borderRadius: 2,
                  p: 1,
                  overflow: "auto",
                  mb: 1,
                }}
              >
                {messages?.map((message: any, key) => {
                  const { content, avatar, user, translatedContent, sendBy, sendAt, type } =
                    message;

                  return (
                    <Message
                      key={key}
                      content={content}
                      avatar={avatar}
                      name={user}
                      translatedContent={translatedContent?.text}
                      userId={sendBy}
                      sendAt={sendAt}
                      lenguage={lenguage}
                      translateMe={translateMe}
                      type={type}
                    />
                  );

                })}
                <div ref={messagesEndRef} />
              </Box>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  gap: 1,
                  p: 1,
                  backgroundColor: "#A8CF45",
                  borderRadius: 2,
                }}
              >

                <Tooltip title="Emojis" placement="top">
                  <Button
                    sx={{ borderRadius: 10 }}
                    variant="contained"
                    color="success"
                    style={{ width: "10px" }}
                    onClick={(event) => toggleShowEmoji(event)}
                    startIcon={<EmojiEmotionsIcon style={{ marginLeft: "10px" }} />}
                    size="small"
                  />
                </Tooltip>
                <Menu
                  sx={{ display: 'flex' }}
                  open={showEmoji}
                  onClose={() => setShowEmoji(false)}
                >
                  <Picker
                    data={data}
                    emojiSize={24}
                    emojiButtonSize={36}
                    onEmojiSelect={addEmoji}
                    maxFrequentRows={0}
                  />
                </Menu>

                <Tooltip title="Attach" placement="top">
                  <Button
                    sx={{ borderRadius: 10 }}
                    variant="contained"
                    color="success"
                    style={{ width: "10px" }}
                    onClick={(event) => toggleImageUpload(event)}
                    startIcon={<CameraAltIcon style={{ marginLeft: "10px" }} />}
                    size="small"
                  />
                </Tooltip>
                <Dialog
                  open={showImageUpload}
                  onClose={() => setShowImageUpload(false)}
                >
                  <ImageUploader
                    showImageUpload={showImageUpload}
                    toggleImageUpload={toggleImageUpload as () => void}
                    setNewMessage={setNewMessage}
                    setShowImageUpload={setShowImageUpload}
                    handleSubmit={() => handleSubmit('image')}
                  />
                </Dialog>

                <TextField
                  sx={{
                    backgroundColor: "white",
                    borderRadius: 10,
                    width: "90%",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 10,
                    },
                  }}
                  size="small"
                  minRows={3}
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                />

                <Tooltip title="Send" placement="top">
                  <Button
                    sx={{ borderRadius: 10 }}
                    variant="contained"
                    color="success"
                    style={{ width: "10%" }}
                    onClick={() => handleSubmit()}
                    startIcon={<SendIcon style={{ marginLeft: "10px" }} />}
                    size="small"
                  >
                  </Button>
                </Tooltip>
              </Box>
            </>
          ) : (
            <Box
              sx={{
                display: "flex",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Tooltip title='<-- Select a chat' placement="left" sx={{fontSize: "50px"}}>
              <Box sx={{marginLeft: 5}}>
              <img src={SelectChat} alt="Select Chat" width={450} />
              </Box>
              </Tooltip>
            </Box>
          )}
        <Dialog
          open={openProfile}
          TransitionComponent={Transition}
        >
          <Profile onClose={handleCloseProfile} />
        </Dialog>
        </Box>
      </Box>
    </>
  );
}
