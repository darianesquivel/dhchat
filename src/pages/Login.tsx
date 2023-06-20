import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext'
import { Box, Button, Typography } from '@mui/material'
import logo from '../assets/images/logo.png';
import bg_dark from '../assets/images/bg_dark.png';
import bg_light from '../assets/images/bg_light.png';

import GoogleIcon from '@mui/icons-material/Google';

export default function Login() {
    const navigate = useNavigate()
    const { user, googleSignIn } = UserAuth()

    useEffect(() => {
        if (user) {
            navigate('/')
        }
    }, [navigate, user])
    return (
        <Box sx={{ display: 'flex', width:'100%', height:'100vh'}}>
            <Box sx={{ width: '50%', display:'flex', justifyContent:'center', alignItems: 'center',
        backgroundImage: `url(${bg_dark})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center', }}>
                <img src={logo} width='400px' alt='DH chat' />
            </Box>
            <Box sx={{ width: '50%', display:'flex', justifyContent:'center', alignItems:'center', 
        backgroundImage: `url(${bg_light})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center', }}>
            <Box sx={{ position: 'absolute', marginTop: '250px' }}>
                <Button variant="contained" onClick={googleSignIn} endIcon={<GoogleIcon />}>
                    Login whit Google
                </Button>
                </Box>
            </Box>
        </Box>
    )
}
