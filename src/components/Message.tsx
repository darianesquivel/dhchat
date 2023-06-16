import { Avatar, Box, Typography } from '@mui/material'



export default function Message(text:any, avatar:any, name:any) {
    return (
        <Box>
            <Typography>{name}</Typography>
            <Avatar alt="avatar" src={avatar} />
            <Typography>{text}</Typography>
        </Box>
    )
}
