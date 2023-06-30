import { Avatar, Box, Button, TextField, Typography } from "@mui/material";
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
} from "firebase/firestore";
import { db } from "../api/Config/firebase";
import Message from "../components/Message";
import SendIcon from "@mui/icons-material/Send";
import bg_light from "../assets/images/bg_light.png";
import Chat from "../components/Chat";
import CustomSelected from "../components/CustomSelect";

export default function Home() {
  const { user } = UserAuth();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const conversationsRef = collection(db, "conversations");
  const [conversations, setConversations] = useState([]);
  const [conversation, setConversation] = useState();
  const [conversationId, setConversationId] = useState("");
  const [displayMessages, setDisplayMessages] = useState(false);
  const [lenguage, setLenguage] = useState("en");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messagesRef, setmessagesRef] = useState<CollectionReference | null>(
    null
  );

  useEffect(() => {
    const getConversations = onSnapshot(
      query(conversationsRef, orderBy("createAt", "desc")),
      (snapshot) => {
        let conversations: any = [];
        snapshot.forEach((doc) => {
          conversations.push({ ...doc.data(), id: doc.id });
        });
        setConversations(conversations);
      }
    );

    return () => {
      getConversations();
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
        addDoc(messagesRef, {
          content: {
            text: newMessage,
          },
          sendAt: serverTimestamp(),
          sendBy: user?.uid,
          avatar: user?.photoURL,
          user: user?.displayName,
          type: "text",
        });

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
          <Typography variant="button" fontWeight={600}>
            Chats
          </Typography>

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
                  p: 1,
                }}
              >
                <Box sx={{ display: "flex", gap: 2, p: 1 }}>
                  <Avatar src={(conversation as any)?.avatar} />
                  <Typography variant="overline" fontWeight={800}>
                    {(conversation as any)?.name}
                  </Typography>
                </Box>

                <CustomSelected setLenguage={setLenguage} />
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
                  const { content, avatar, user, translatedContent, sendBy } =
                    message;
                  return (
                    <Message
                      key={key}
                      content={content.text}
                      avatar={avatar}
                      name={user}
                      translatedContent={translatedContent?.text}
                      userId={sendBy}
                      lenguage={lenguage}
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
                  borderEndEndRadius: 10,
                }}
              >
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
                <Button
                  sx={{ borderRadius: 10 }}
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
            </>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Typography variant="button" fontWeight={600}>
                {" "}
                Select a chat
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}
