import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/Login'
import { UserAuth } from '../context/AuthContext'
import NewHome from '../pages/NewHome'

export default function CustomRoutes() {
  const { user } = UserAuth()

  const RequireAuth = ({ children }: any) => {
    return user ? children : <Navigate to={'/login'} />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<RequireAuth><NewHome /></RequireAuth>} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}
