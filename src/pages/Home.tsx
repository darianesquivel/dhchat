import { Box, Button, TextField } from "@mui/material"
import Navbar from "../components/Navbar"
import { UserAuth } from "../context/AuthContext"
import { useEffect, useState } from "react"
import { addDoc, collection, serverTimestamp, query, onSnapshot, orderBy } from 'firebase/firestore'
import { db } from "../api/Config/firebase"
import Message from "../components/Message"
import Chat from "../components/Chat"

export default function Home() {
  const { user } = UserAuth()
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState([])
  const messagesRef = collection(db, 'messages')

  const handleSubmit =  () => {
    try {
      if (newMessage === "") return;
       addDoc(messagesRef, {
        content: newMessage,
        sendAt: serverTimestamp(),
        sendBy: user?.uid,
        avatar: user?.photoURL,
        user: user?.displayName
      })
      setNewMessage("")
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {

    const queryMessages = query(messagesRef, orderBy('sendAt'))

    onSnapshot(queryMessages, (snapshot) => {
      let messages: any = []
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id })
      })
      setMessages(messages)
    })

  }, [])

  return (
    <>
      <Navbar />
      <Box sx={{ height: '92vh', display: 'flex', p: 2, gap: 1 }}>
        <Box sx={{ width: '10%', border: 'solid 1px grey', borderRadius: 2, p: 2, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Chat />
        </Box>
        <Box sx={{ width: '90%', border: 'solid 1px grey', borderRadius: 2, p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '90%', border: 'solid 1px grey', borderRadius: 2, p: 2, overflow: 'auto' }}>

            {
              messages?.map((message: any, key) => {
                const { content, avatar, user, translatedContent, sendBy } = message
                return (
                  <Message
                    key={key}
                    content={content}
                    avatar={avatar}
                    name={user}
                    translatedContent={translatedContent}
                    userId={sendBy}
                  />

                )
              })
            }

          </Box>
          <Box sx={{ width: '100%', display: 'flex', gap: 1 }} >
            <TextField style={{ width: '90%' }} type="text" onChange={(e) => setNewMessage(e.target.value)} value={newMessage} />
            <Button variant="outlined" color="success" style={{ width: '10%' }} onClick={handleSubmit}>Send</Button>
          </Box>

        </Box>
      </Box>
    </>

  )
}
