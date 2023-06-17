import { Avatar, Box, Button, Chip, TextField, Typography } from "@mui/material"
import Navbar from "../components/Navbar"
import { UserAuth } from "../context/AuthContext"
import { useEffect, useState } from "react"
import { addDoc, collection, serverTimestamp, query, onSnapshot, orderBy } from 'firebase/firestore'
import { db } from "../api/Config/firebase"
import { grey } from "@mui/material/colors"
import Message from "../components/Message"
import Chat from "../components/Chat"

export default function Home() {
  const { user } = UserAuth()
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState([])
  const messagesRef = collection(db, 'messages')

  const handleSubmit = async () => {
    try {

      if (newMessage === "") return;

      await addDoc(messagesRef, {
        content: newMessage,
        createdAt: serverTimestamp(),
        user: user?.displayName,
        avatar: user?.photoURL,
        translatedContent: ''
      })

      setNewMessage("")

    } catch (error) {
      console.error(error)
    }

  }

  useEffect(() => {

    const queryMessages = query(messagesRef, orderBy('createdAt'))

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
        <Box sx={{ width: '10%', border: 'solid 1px grey', borderRadius: 2, p: 2, display:'flex', flexDirection:'column', gap:0.5 }}>
          <Chat/>
          <Chat/>
          <Chat/>
          <Chat/>
          <Chat/>
        </Box>
        <Box sx={{ width: '90%', border: 'solid 1px grey', borderRadius: 2, p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '90%', border: 'solid 1px grey', borderRadius: 2, p: 2, overflow:'auto' }}>

            {
              messages?.map((message: any, key) => {
                const {content, avatar, user, translatedContent} = message
                return (
                  <Message key={key} content={content} avatar={avatar} name={user} translatedContent={translatedContent}/>
                )
              })
            }

          </Box>
          <Box sx={{ width: '100%', display:'flex', gap:1 }} >
            <TextField style={{ width: '90%' }} type="text" onChange={(e) => setNewMessage(e.target.value)} value={newMessage} />
            <Button variant="outlined" color="success" style={{ width: '10%' }} onClick={handleSubmit}>Send</Button>
          </Box>

        </Box>
      </Box>
    </>

  )
}
