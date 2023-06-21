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
        <Box sx={{ display: 'flex', height:'100vh', justifyContent:'center', alignItems: 'center',
        backgroundImage: `url(${bg_dark})`, backgroundRepeat: 'repeat' }}>
            <Box sx={{ position: 'absolute', alignItems: 'center', marginTop: '-100px'  }}>
                <img src={logo} width='400px' alt='DH chat' />
            </Box>
            <Box sx={{ position: 'absolute', marginTop: '300px', alignItems: 'center' }}>
                <Button variant="contained" size='large' onClick={googleSignIn} endIcon={<GoogleIcon />}>
                    Login with Google
                </Button>
            </Box>
        </Box>
    )
}