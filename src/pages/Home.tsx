import { Avatar, Box, Typography } from "@mui/material"
import Navbar from "../components/Navbar"
import { UserAuth } from "../context/AuthContext"
import { useEffect, useState } from "react"
import { addDoc, collection, serverTimestamp, query, onSnapshot, where, getDocs, orderBy } from 'firebase/firestore'
import { db } from "../api/Config/firebase"
import Message from "../components/Message"


export default function Home() {
  const { user } = UserAuth()
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState([])
  const messagesRef = collection(db, 'messages')

  const handleSubmit = async () => {
    try {

      if (newMessage === "") return;

      await addDoc(messagesRef, {
        text: newMessage,
        createdAt: serverTimestamp(),
        user: user?.displayName,
        avatar: user?.photoURL
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
      <Box sx={{ height: '90vh', display: 'flex', p: 2, gap: 1 }}>
        <Box sx={{ width: '10%', border: 'solid 1px black', borderRadius: 2, p: 2 }}>
        </Box>
        <Box sx={{ width: '90%', border: 'solid 1px black', borderRadius: 2, p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '90%', border: 'solid 1px black', borderRadius: 2, p: 2 }}>

            {
              messages?.map((message: any) => {
                return (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap:1, m:1}}>
                    <Avatar alt="avatar" src={message.avatar} />
                    <Box sx={{border:'1px solid grey', borderRadius:2, p:1}}>
                      <Typography variant="body1">{message.user}</Typography>
                      <Typography variant="body2">{message.text}</Typography>
                    </Box>
                  </Box>
                )
              })
            }

          </Box>
          <Box sx={{ width: '100%' }} >
            <input style={{ width: '90%' }} type="text" onChange={(e) => setNewMessage(e.target.value)} value={newMessage} />
            <button style={{ width: '10%' }} onClick={handleSubmit}>Send</button>
          </Box>

        </Box>
      </Box>
    </>

  )
}
