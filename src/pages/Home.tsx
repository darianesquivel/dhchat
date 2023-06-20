import { Box, Button, TextField } from "@mui/material";
import Navbar from "../components/Navbar";
import { UserAuth } from "../context/AuthContext";
import { useLayoutEffect, useRef, useState } from "react";
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

  useLayoutEffect(() => {
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

  useLayoutEffect(() => {
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
      <Navbar />
      <Box sx={{ height: "92vh", display: "flex", p: 2, gap: 1 }}>
        <Box
          sx={{
            width: "10%",
            border: "solid 1px grey",
            borderRadius: 2,
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
          }}
        >
        </Box>
        <Box
          sx={{
            width: "90%",
            border: "solid 1px grey",
            borderRadius: 2,
            p: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "90%",
              border: "solid 1px grey",
              borderRadius: 2,
              p: 2,
              overflow: "auto",
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
          <Box sx={{ width: "100%", display: "flex", gap: 1 }}>
            <TextField
              style={{ width: "90%" }}
              minRows={3}
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button
              variant="outlined"
              color="success"
              style={{ width: "10%" }}
              onClick={handleSubmit}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}
