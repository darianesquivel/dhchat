import Navbar from "../components/Navbar"
import { UserAuth } from "../context/AuthContext"

export default function Home() {
    const {user} = UserAuth()
    console.log({user})
  return (
    <div>
        <Navbar/>
        <h1>Home</h1>
        <p>Hola {user?.displayName}</p>
    </div>
  )
}
