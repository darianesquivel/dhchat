import { Avatar, Box, Chip, Skeleton, Typography } from "@mui/material";
import { UserAuth } from "../context/AuthContext";

interface MessageProps {
  content: string;
  avatar: string;
  name: string;
  userId: string;
  lenguage: string;
  translatedContent?: {
    de?: string;
    en?: string;
    es?: string;
    fr?: string;
  };
}

export default function Message({
  content,
  avatar,
  name,
  translatedContent,
  userId,
  lenguage,
}: MessageProps) {
  const { user } = UserAuth();
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
        <Avatar alt="avatar" src={avatar} />
      </Box>

      <Box sx={{ p: 0.5 }}>
        <Typography sx={{ p: 0.3 }} fontWeight={600} variant="body2">
          {user?.uid !== userId ? name : null}
        </Typography>

        {user?.uid !== userId ? (
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
        ) : null}

        <Box
          sx={{
            py: 0.5,
            px: 2,
            ml: 2,
            background: "#f1f1f1",
            borderRadius: 10,
            display: "inline-block",
          }}
        >
          <Typography
            variant="body2"
            fontSize={8}
            align="inherit"
            color={"grey"}
          >
            {user?.uid !== userId ? "original" : "me"}
          </Typography>
          <Typography variant="caption"> {content}</Typography>
        </Box>
      </Box>
    </Box>
  );
}
