import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext'
import { Box, Button } from '@mui/material'
import logo from '../assets/images/logo.png';
import useStyles from './styles'

import GoogleIcon from '@mui/icons-material/Google';

export default function Login() {
    const classes = useStyles()
    const navigate = useNavigate()
    const { user, googleSignIn } = UserAuth()

    useEffect(() => {
        if (user) {
            navigate('/')
        }
    }, [navigate, user])
    

    return (
    <Box className={classes.boxBackgroundLogin}>
    <Box className={classes.boxLogoLogin}>
        <img src={logo} width='400px' alt='DH chat' />
    </Box>
    <Box className={classes.boxButtonLogin}>
        <Button variant="contained" size='large' onClick={googleSignIn} endIcon={<GoogleIcon />}>
            Login with Google
        </Button>
    </Box>
    </Box>
    )
}