import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext'
import { Box, Button, Typography } from '@mui/material'

import GoogleIcon from '@mui/icons-material/Google';

export default function Login() {
    const navigate = useNavigate()
    const { user, googleSignIn } = UserAuth()

    useEffect(() => {
        if (user) {
            navigate('/')
        }
    }, [user])
    return (
        <Box sx={{ display: 'flex', width:'100%', height:'100vh' }}>
            <Box sx={{ width: '50%' , display:'flex',justifyContent:'center', alignItems:'center', backgroundColor:'#A8CF45'}}>
                <Typography color={'white'} variant='h3'>DH chat</Typography>
            </Box>
            <Box sx={{ width: '50%', display:'flex', justifyContent:'center', alignItems:'center'}}>
                <Button variant="contained" onClick={googleSignIn} endIcon={<GoogleIcon />}>
                    Login whit Google
                </Button>
            </Box>
        </Box>
    )
}
