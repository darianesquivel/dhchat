import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext'
import { Box, Button, Typography } from '@mui/material'
import logo from '../assets/images/logo.png';
import bg_dark from '../assets/images/bg_dark.png';
import bg_light from '../assets/images/bg_light.png';
import hola_hands from '../assets/images/hola_hands.png';


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
            <Box sx={{ position: 'absolute' }}>
            <img src={hola_hands} width='500px' alt='DH chat' />
            </Box>
            <Box sx={{ position: 'absolute', marginTop: '250px' }}>
                <Button variant="contained" size='large' onClick={googleSignIn} endIcon={<GoogleIcon />}>
                    Login with Google
                </Button>
                </Box>
            </Box>
        </Box>
    )
}