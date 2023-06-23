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
                { display: 'flex', alignItems: 'flex-start', gap: 1, m: 1, }
                : { display: 'flex', flexDirection: 'row-reverse', alignItems: 'flex-start', gap: 1, m: 1, justifyContent: 'flex-start' }
        }>  
            <Box >

            <Avatar alt="avatar" src={avatar} />
            </Box>
            <Box sx={
                user?.uid !== userId ?
                    { borderRadius: 2, p: .5 }
                    : { borderRadius: 2, p: .5 }
            }>
                <Typography sx={{p:.3}} variant="body2" >{ user?.uid !== userId ? name : null}</Typography>
                <Typography sx={ user?.uid !== userId ? {} : {background: '#f1f7e1', borderRadius:5, p:1}} variant="caption">{content}</Typography>

                {
                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: .5, p: .5 }}>
                        <Typography sx={{ display: 'flex', gap: 1, borderRadius:5, p:.5, alignItems:'center', background: '#f1f7e1'}} fontSize={10} color={'grey'} variant="caption">
                            <Chip color="success" size="small" label={'en'} />  {translatedContent?.en ? translatedContent.en : <Skeleton width={40} />}
                        </Typography>
                    </Box>
                }
                             
            </Box>
        </Box>
    )
}
