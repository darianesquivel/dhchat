import { Avatar, Box, Chip, Skeleton, Typography } from "@mui/material";
import moment from 'moment';
import { UserAuth } from "../context/AuthContext";

interface MessageProps {
  content: string;
  avatar: string;
  name: string;
  userId: string;
  lenguage: string;
  sendAt: {
    seconds: number;
    nanoseconds: number;
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
}

export default function Message({
  content,
  avatar,
  name,
  translatedContent,
  userId,
  lenguage,
  sendAt
}: MessageProps) {
  const { user } = UserAuth();
  const timestampInMilliseconds = sendAt.seconds * 1000 + sendAt.nanoseconds / 1000000;
  const formattedDate = moment(timestampInMilliseconds).format('DD/MM/YYYY HH:mm');

  return (
    <Box
      sx={
        user?.uid !== userId
          ? { display: "flex", alignItems: "flex-start", gap: 1, m: 1 }
          : {
              display: "flex",
              flexDirection: "row-reverse",
              alignItems: "flex-start",
              gap: 0.5,
              m: 0.5,
              justifyContent: "flex-start",
            }
      }
    >
      <Box>
        <Avatar alt="avatar" src={avatar} style={{ width: '60px', height: '60px' }} />
      </Box>

      <Box sx={{ p: 0.5 }}>
        <Typography sx={{ p: 0.3 }} fontWeight={600} variant="body2">
          {user?.uid !== userId ? name : null}
        </Typography>

        {/* {user?.uid !== userId ? ( */}
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 0.5, p: 0.5 }}
          >
            <Typography
              sx={{
                display: "flex",
                gap: 1,
                borderRadius: 5,
                p: 0.5,
                alignItems: "center",
                background: "#f1f7e1",
                fontSize: "14px",
              }}
              variant="caption"
            >
              <Chip color="success" size="small" label={lenguage} />
              {translatedContent?.[
                lenguage as keyof typeof translatedContent
              ] ? (
                translatedContent[lenguage as keyof typeof translatedContent]
              ) : (
                <Skeleton width={40} />
              )}
            </Typography>
          </Box>
        {/* ) : null} */}
      </Box>
    </Box>
  );
}
