import { UserAuth } from "../context/AuthContext"
export default function Navbar() {
    const {logOut} = UserAuth()
  return (
    <div>
        <button onClick={logOut}>Logout</button>
    </div>
  )
}
