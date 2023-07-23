import { Avatar, Box, Chip, Skeleton, Typography } from "@mui/material";
import moment from 'moment';
import { UserAuth } from "../context/AuthContext";

interface MessageProps {
  content: string;
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
  type: string
}

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

  return (
    <>
      {user?.uid !== userId ? (
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, m: 1 }}>
          <Box>
            <Avatar alt="avatar" src={avatar} style={{ width: '60px', height: '60px' }} />
          </Box>
          <Box sx={{ p: 0.5 }}>
            <Typography sx={{ p: 0.3, textAlign: "start" }} fontWeight={600} variant="body2">{name}</Typography>
            <Box
              sx={{
                background: "#eeeeee",
                display: "inline-block",
                borderRadius: 3,
                padding: '10px 15px',
                marginTop: '10px',
                marginLeft: 'auto',
                position: 'relative',
              }}
            >
              <Typography variant="body2" fontSize={10} align="left" color={"grey"}>
                {`${formattedDate}`}
              </Typography>
              <Box
                sx={{
                  position: 'absolute',
                  content: '""',
                  borderStyle: 'solid',
                  borderWidth: '10px 0 10px 10px',
                  borderColor: 'transparent transparent transparent #eeeeee',
                  top: '-10px',
                  left: '15px',
                  right: 'auto',
                  transform: 'translateX(-50%)',
                }}
              />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, p: 0.5 }}>
              <Typography
                sx={{
                  display: "flex",
                  gap: 1,
                  borderRadius: 3,
                  p: 0.5,
                  alignItems: "center",
                  background: "#f1f7e1",
                  fontSize: "14px",
                  marginLeft: "-36px",
                }}
                variant="caption"
              >
                <Chip color="success" size="small" label={lenguage} sx={{ width: '35px' }} />
                {translatedContent?.[lenguage as keyof typeof translatedContent] ? (
                  translatedContent[lenguage as keyof typeof translatedContent]
                ) : (
                  <Skeleton width={40} />
                )}
              </Typography>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row-reverse",
            alignItems: "flex-start",
            gap: 1,
            m: 1,
            justifyContent: "flex-start",
          }}
        >
          <Box>
            <Avatar alt="avatar" src={avatar} style={{ width: '60px', height: '60px' }} />
          </Box>
          <Box sx={{ p: 0.5, alignItems: "end", textAlign: "end" }}>
            <Typography sx={{ p: 0.3, textAlign: "end" }} fontWeight={600} variant="body2">Me</Typography>

            <Box
              sx={{
                background: "#eeeeee",
                display: "inline-block",
                borderRadius: 3,
                padding: '10px 15px',
                marginTop: '10px',
                marginLeft: 'auto',
                position: 'relative',
              }}
            >
              <Typography variant="body2" fontSize={10} align="right" color={"grey"}>
                {`${formattedDate}`}
              </Typography>

              {
                type === 'image' ?
                  <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                    <img
                      src={content.replace(/(\.[^.]+)$/, '_250x250$1')}
                      alt=""
                      style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }}
                    />

                  </Box> :
                  <Typography variant="caption" sx={{ fontSize: "14px" }}>{content}</Typography>
              }
              <Box
                sx={{
                  position: 'absolute',
                  content: '""',
                  borderStyle: 'solid',
                  borderWidth: '10px 10px 0 10px',
                  borderColor: 'transparent #eeeeee transparent transparent',
                  top: '-10px',
                  left: 'auto',
                  right: '0px',
                  transform: 'translateX(-50%)',
                }}
              />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, p: 0.5 }}>
              {translateMe && (
                <Typography
                  sx={{
                    display: "block",
                    gap: 1,
                    borderRadius: 3,
                    p: 0.5,
                    alignItems: "center",
                    background: "#f1f7e1",
                    fontSize: "14px",
                    textAlign: "end",
                    marginRight: "-38px",
                  }}
                  variant="caption"
                >
                  {translatedContent?.[lenguage as keyof typeof translatedContent] ? (
                    translatedContent[lenguage as keyof typeof translatedContent]
                  ) : (
                    <Skeleton width={40} />
                  )}
                  <Chip color="success" size="small" label={lenguage} sx={{ width: '35px', marginLeft: '10px' }} />
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}
