import { Box, Button, TextField, Typography } from "@mui/material";
import Navbar from "../components/Navbar";
import { UserAuth } from "../context/AuthContext";
import { useEffect, useRef, useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { db } from "../api/Config/firebase";
import Message from "../components/Message";
import SendIcon from '@mui/icons-material/Send';
import bg_light from '../assets/images/bg_light.png'
import logo from '../assets/images/logo.png';


export default function Home() {
  const { user } = UserAuth();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesRef = collection(db, "messages");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = () => {
    try {
      if (newMessage === "") return;
      addDoc(messagesRef, {
        content: newMessage,
        sendAt: serverTimestamp(),
        sendBy: user?.uid,
        avatar: user?.photoURL,
        user: user?.displayName,
      });
      setNewMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const queryMessages = query(messagesRef, orderBy("sendAt"));

    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages: any = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      <Box sx={{ height: "90vh", display: "flex", p: 1, gap: 1, backgroundColor:"#f1f1f1"}}>
        <Box
          sx={{
            width: "10%",
            borderRadius: 2,
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            backgroundColor:'white',
            alignItems: 'center',
          }}
        >
        <img src={logo} width='95%' alt='DH chat'/>
        </Box>
        <Box
          sx={{
            width: "90%",
            borderRadius: 2,
            p: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundImage:`url(${bg_light})`,
            backgroundSize: 'contain',
            backgroundColor:'white'
              
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "90%",
              borderRadius: 2,
              p: 1,
              overflow: "auto",
              mb:1
            }}
          >
            {messages?.map((message: any, key) => {
              const {
                content,
                avatar,
                user,
                translatedContent,
                sendBy,
              } = message;
              return (
                <Message
                  key={key}
                  content={content}
                  avatar={avatar}
                  name={user}
                  translatedContent={translatedContent}
                  userId={sendBy}
                />
              );
            })}
            <div ref={messagesEndRef} /> 
          </Box>
          <Box sx={{ width: "100%",display: "flex", gap: 1 }}>
            <TextField
              sx={{
                backgroundColor:'white',
                width:'90%',
                '& .MuiOutlinedInput-root': {
                  borderRadius: 10
                },
              }}
              minRows={3}
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button
            sx={{borderRadius:10}}
              variant="contained"
              color="success"
              style={{ width: "10%" }}
              onClick={handleSubmit}
              endIcon={<SendIcon />}
              size="small"
            >
              Send
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}
