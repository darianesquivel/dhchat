import { Avatar, Box, Chip, Skeleton, Typography } from '@mui/material'
import { UserAuth } from '../context/AuthContext';

interface MessageProps {
    content: string,
    avatar: string,
    name: string,
    userId: string,
    translatedContent?: {
        en?: string;
        zh?: string;
    };
}


export default function Message({ content, avatar, name, translatedContent, userId }: MessageProps) {
    const { user } = UserAuth()

    return (
        <Box sx={
            user?.uid !== userId ?
                { display: 'flex', alignItems: 'center', gap: 1, m: 1 }
                : { display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', gap: 1, m: 1, justifyContent: 'flex-start' }
        }>
            <Avatar alt="avatar" src={avatar} />
            <Box sx={
                user?.uid !== userId ?
                    { border: '1px solid grey', borderRadius: 2, p: 1 }
                    : { borderRadius: 2, p: 1, background: '#A8CF45' }
            }>
                <Typography variant="body2" >{name}</Typography>
                <Typography variant="caption">{content}</Typography>

                {
                    user?.uid !== userId ? <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 1 }}>
                        <Typography sx={{ display: 'flex', gap: 1 }} fontSize={10} color={'grey'} variant="caption">
                            <Chip color="success" size="small" label={'en'} />  {translatedContent?.en ? translatedContent.en : <Skeleton width={40} />}
                        </Typography>
                    </Box> : null
                }

            </Box>
        </Box>
    )
}
