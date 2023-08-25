import { Avatar, Box, Chip, Skeleton, Typography } from "@mui/material";
import moment from 'moment';
import { UserAuth } from "../context/AuthContext";
import { makeStyles } from "@mui/styles";

interface MessageProps {
  content: {
    text: string;
    imageUrl: string;
    audioUrl: string;
  };
  avatar: string;
  name: string;
  userId: string;
  lenguage: string;
  sendAt?: {
    seconds?: number;
    nanoseconds?: number;
  };
  translatedContent?: {
    ar?: string;
    de?: string;
    es?: string;
    en?: string;
    fr?: string;
    hi?: string;
    it?: string;
    ja?: string;
    pl?: string;
    pt?: string;
    ru?: string;
    zh?: string;
  };
  showTranslateMe?: boolean;
  translateMe?: boolean;
  type: string;
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
  },
  containerLogUser: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingRight: 10
  },
  avatar: {
    position: 'relative',
    top: '10px'
  },
  avatarMessage: {
    display: 'flex',
    gap: 20,
  },
  avatarMessageLoginUser: {
    display: 'flex',
    flexDirection: 'row-reverse',
    gap: 20,

  },
  nameContentDate: {
    background: "#EAEAEA",
    display: "inline-block",
    borderRadius: 12,
    padding: '10px',
    position: 'relative',
  },
  nameContentDateLogUser: {
    background: "#a8cf45",
    display: "inline-block",
    borderRadius: 12,
    padding: '10px',
    marginTop: '10px',
    marginLeft: 'auto',
    position: 'relative',
    textAlign: 'end'
  },
  name: {
    fontSize: 14,
    fontWeight: 600,
  },
  date: {
    fontSize: 10,
    textAlign: 'end',
  },
  bubbleDialog: {
    position: 'absolute',
    borderStyle: 'solid',
    borderWidth: '10px 0 10px 10px',
    borderColor: 'transparent transparent transparent #EAEAEA',
    top: '10px',
    left: '-8px',
    right: 'auto',
    transform: 'rotate(-40deg)'
  },
  bubbleDialogLogUser: {
    position: 'absolute',
    borderStyle: 'solid',
    borderWidth: '10px 10px 10px 10px',
    borderColor: 'transparent #a8cf45 transparent transparent',
    top: '10px',
    right: '-8px',
    transform: 'rotate(40deg)'
  },
  image: {
    maxWidth: '100%', maxHeight: '300px', objectFit: 'contain'
  },
  translateMessage: {
    width: 'fit-content',
    display: "inline-block",
    borderRadius: 8,
    padding: '2px 5px',
    margin: 1,
    background: "#F1F7E1",
  },
  chip: {
    marginRight: 5
  },
  messagesContainer: {
    display: 'flex',
    flexDirection: 'column'
  }
}));

export default function Message({
  content,
  avatar,
  name,
  translatedContent,
  userId,
  lenguage,
  sendAt,
  translateMe,
  type
}: MessageProps) {

  const { user } = UserAuth();
  const timestampInMilliseconds = (sendAt?.seconds && sendAt?.nanoseconds) ? sendAt.seconds * 1000 + sendAt.nanoseconds / 1000000 : 0;
  const formattedDate = moment(timestampInMilliseconds).format('DD/MM/YYYY HH:mm');
  const classes = useStyles()

  const MessageContent = () => {
    switch (type) {
      case 'text':
        return <Box>
          <Typography variant="subtitle2">{content.text}</Typography>
        </Box>
      case 'image':
        return <img className={classes.image} src={content.imageUrl} alt="Imagen" />;
      case 'audio':
        return (
          <audio controls>
            <source src={content.audioUrl} type="audio/mpeg" />
          </audio>
        );
      default:
        return null;
    }
  }

  return (
    <Box className={user?.uid === userId ? classes.containerLogUser : classes.container}>
      <Box className={user?.uid === userId ? classes.avatarMessageLoginUser : classes.avatarMessage}>
        {user?.uid === userId ? null : <Avatar className={classes.avatar} src={avatar} />}
        <Box className={classes.messagesContainer}>
          <Box className={`${user?.uid === userId && type !== 'audio' ? classes.nameContentDateLogUser : null} ${user?.uid !== userId && type !== 'audio' ? classes.nameContentDate : null}`} >
            <Typography className={classes.name}> {user?.uid === userId ? null : `${name}`} </Typography>
            <MessageContent />
            <Typography className={classes.date} >{formattedDate}</Typography>
            <Box className={user?.uid === userId ? classes.bubbleDialogLogUser : classes.bubbleDialog} />
          </Box>
          {
            (user?.uid !== userId || translateMe) && type === 'text' ?
              <Typography variant="caption" className={classes.translateMessage}>
                <Chip color="success" size="small" label={lenguage} className={classes.chip} />
                {translatedContent?.[lenguage as keyof typeof translatedContent] ? (
                  translatedContent[lenguage as keyof typeof translatedContent]
                ) : (<Skeleton width={40} />)} </Typography> : null
          }
        </Box>
      </Box>
    </Box>
  );
}
