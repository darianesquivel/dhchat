import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import { UserAuth } from '../context/AuthContext'
import CustomDrawer from '../pages/CustomDrawer'

export default function CustomRoutes() {
    const {user} = UserAuth()

    const RequireAuth = ({children}:any) =>{
        return user ? children : <Navigate to={'/login'}/>
    }

  return (
    <BrowserRouter>
    <Routes>
        <Route path='/' element={<RequireAuth><CustomDrawer/></RequireAuth>}/>
        <Route path='/login' element={<Login/>}/>
    </Routes>
    </BrowserRouter>
  )
}
