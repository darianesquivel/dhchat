import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { UserAuth } from '../context/AuthContext'

export default function Login() {
    const navigate = useNavigate()
    const {user, googleSignIn} = UserAuth()

    useEffect(()=>{
        if(user){
            navigate('/')
        }
    },[user])

  return (
    <div>
        <button onClick={googleSignIn}>Sing in with google</button>
    </div>
  )
}
