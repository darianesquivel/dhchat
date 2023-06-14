import { useState } from 'react'
import {auth, googleProvider} from '../Config/firebase'
import {createUserWithEmailAndPassword, signInWithPopup, signOut} from 'firebase/auth'
export default function Login() {

 const [email, setEmail] = useState('')
 const [password, setPassword] = useState('')

 const signIn = async () => {
    try {
        await createUserWithEmailAndPassword(auth, email, password)
    } catch (error) {
        console.error(error)
    }
    
 }

 const signInWithGoogle = async () => {
    try {
        await signInWithPopup(auth, googleProvider)
    } catch (error) {
        console.error(error)
    }
    
 }

 const logOut = async () => {
    try {
        await signOut(auth)
    } catch (error) {
        console.error(error)
    }
    
 }

 console.log({auth})

  return (
    <div>
        <input type="text" placeholder='Email...' onChange={(e)=> setEmail(e.target.value)}/>
        <input type="text" placeholder='Password...' onChange={(e)=> setPassword(e.target.value)}/>
        <button onClick={signIn}>Sing in</button>
        <button onClick={signInWithGoogle}>Sing in with google</button>
        <button onClick={logOut}>Log Out</button>
    </div>
  )
}
