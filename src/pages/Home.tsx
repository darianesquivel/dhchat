import { Avatar, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import { UserAuth } from "../context/AuthContext";
import { useEffect, useRef, useState } from "react";
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
import AttachFileIcon from '@mui/icons-material/AttachFile';
import bg_light from "../assets/images/bg_light.png";
import logo from '../assets/images/logo.png'
import Chat from "../components/Chat";
import CustomSelected from "../components/CustomSelect";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import ImageUploader from '../components/ImageUploader';
import AddIcon from '@mui/icons-material/Add';
import ListAvatar from "../components/ListAvatar";

export default function Home() {
  const { user } = UserAuth();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const conversationsRef = collection(db, "conversations");
  // const userRef = collection(db, "users");
  const [conversations, setConversations] = useState([]);
  const [conversation, setConversation] = useState();
  const [conversationId, setConversationId] = useState("");
  const [displayMessages, setDisplayMessages] = useState(false);
  const [lenguage, setLenguage] = useState("en");
  const [translateMe , setTranslateMe] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
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

    await addDoc(conversationsRef,newConversation);
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
          if(doc.data().participants?.includes(user?.email) || doc.data().participants?.includes("open-group") ){
            conversations.push({ ...doc.data(), id: doc.id });
          }
        });
        setConversations(conversations);
      }
    );

    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const userData:any = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
  
        const filteredUsers = userData.filter((u:any) => u.email !== user?.email);
        setUsers(filteredUsers);
      } catch (error) {
        console.error(error);
      }
    };

    return () => {
      getConversations();
      fetchUsers()
    };
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

  const handleSubmit = () => {
    try {
      if (newMessage === "") return;
      if (messagesRef) {
        if (uploadedImageUrl) {
          const messageData = {
            content: {
              text: newMessage,
              image: uploadedImageUrl
            },
            sendAt: serverTimestamp(),
            sendBy: user?.uid,
            avatar: user?.photoURL,
            user: user?.displayName,
            type: "image"
          };
  
          addDoc(messagesRef, messageData);
  
          const conversationRef = doc(
            collection(db, "conversations"),
            conversationId
          );
  
          updateDoc(conversationRef, {
            lastMessage: newMessage,
            lastMessageSendBy: user?.displayName,
          });
  
          setNewMessage("");
          setUploadedImageUrl("");
        } else {
          const messageData = {
            content: {
              text: newMessage
            },
            sendAt: serverTimestamp(),
            sendBy: user?.uid,
            avatar: user?.photoURL,
            user: user?.displayName,
            type: "text"
          };
  
          addDoc(messagesRef, messageData);
  
          const conversationRef = doc(
            collection(db, "conversations"),
            conversationId
          );
  
          updateDoc(conversationRef, {
            lastMessage: newMessage,
            lastMessageSendBy: user?.displayName,
          });
  
          setNewMessage("");
        }
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

  return (
    <>
      <Box
        sx={{
          height: "90vh",
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
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            backgroundColor: "white",
            alignItems: "center",
          }}
        >
          <img width="100px" src={logo} alt="logo" />
          <Divider orientation="horizontal" flexItem sx={{marginTop:"20px", marginBottom:"5px"}}/>

          <Box sx={{display:'flex',alignItems:'center', gap:1}}>
          <Typography variant="button" fontWeight={600}>
            Chats
          </Typography>
          <IconButton onClick={handleClickOpen}><AddIcon fontSize="small"/></IconButton>
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
        <TextField onChange={(e)=> setChatName(e.target.value)} id="outlined-basic" label="Name" variant="outlined" />
        <TextField onChange={(e)=> setAvatar(e.target.value)} id="outlined-basic" label="Avatar" variant="outlined" />
        <ListAvatar users = {users} onAddParticipants = {setParticipants} currentUser = {user?.email}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmitNewChat} autoFocus>
            Add
          </Button>
        </DialogActions>
      </Dialog>
          </Box>

          {conversations?.map((conversation: any, key) => {
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
                onClick={handleClickConversation}
              />
            );
          })}
        </Box>
        <Box
          sx={{
            width: "85%",
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundImage:  `url(${bg_light})`,
            backgroundSize: "contain",
            backgroundColor: "white",
          }}
        >
          {displayMessages ? (
            <>
              <Box
                sx={{
                  backgroundColor: "#f1f7e1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 1,
                }}
              >
                <Box sx={{ display: "flex", gap: 2, p: 1 }}>
                  <Avatar src={(conversation as any)?.avatar} variant="rounded"  style={{ width: '60px', height: '60px' }}/>
                  <Box>
                  <Typography variant="overline" fontWeight={800}>
                    {(conversation as any)?.name}
                  </Typography>
                  <Box sx={{display:'flex',gap:1}}>
                  {(conversation as any)?.participants.map((e:any)=><Chip sx={{fontSize:10}} size="small" label={e}/>)} 
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

                    if (type === "image") {
                      return (
                        <Message
                          key={key}
                          content={content.image}
                          avatar={avatar}
                          name={user}
                          userId={sendBy}
                          sendAt={sendAt}
                          lenguage={lenguage}
                          handleSubmit={handleSubmit}                        
                        />
                      );
                    } else {
                      return (
                        <Message
                          key={key}
                          content={content.text}
                          avatar={avatar}
                          name={user}
                          translatedContent={translatedContent?.text}
                          userId={sendBy}
                          sendAt={sendAt}
                          lenguage={lenguage}
                          translateMe={translateMe} 
                          handleSubmit={handleSubmit}                        
                        />
                      );
                    }
                  })}
                  <div ref={messagesEndRef} />
                </Box>

                {showEmoji && (
                  <Box
                  sx={{
                    display: "flex",
                    position: "absolute",
                    marginTop: "336px",
                  }}
                  ref={emojiContainerRef}
                  >     
                  <Picker
                    data={data}
                    emojiSize={24}
                    emojiButtonSize={36}
                    onEmojiSelect={addEmoji}
                    maxFrequentRows={0}
                    //locale={en}
                  />
                  </Box>
                )}

                {showImageUpload && (
                <Box
                sx={{
                  display: "flex",
                  position: "absolute",
                  marginTop: "716px",
                  //marginBottom: "15px",
                  marginLeft: "80px",
                }}
                ref={formContainerRef}
                >    
                  <ImageUploader 
                    showImageUpload={showImageUpload}
                    toggleImageUpload={toggleImageUpload as () => void}
                    setUploadedImageUrl={setUploadedImageUrl}
                    handleSubmit={handleSubmit}
                  />
                </Box>
              )}

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
                  style={{ width: "10px"}}
                  onClick={(event) => toggleShowEmoji(event)}
                  startIcon={<EmojiEmotionsIcon style={{ marginLeft: "10px" }}/>}
                  size="large"
                >
                </Button>
                </Tooltip>

                <Tooltip title="Attach" placement="top">
                <Button
                  sx={{ borderRadius: 10 }}
                  variant="contained"
                  color="success"
                  style={{ width: "10px"}}
                  onClick={(event) => toggleImageUpload(event)}
                  startIcon={<AttachFileIcon style={{ marginLeft: "10px" }}/>}
                  size="large"
                >
                </Button>
                </Tooltip>
              
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
                  onClick={handleSubmit}
                  startIcon={<SendIcon style={{ marginLeft: "10px" }} />}
                  size="large"
                >
                </Button>
                </Tooltip>
              </Box>
            </>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Typography variant="button" fontWeight={600}>
             Select a chat
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}
