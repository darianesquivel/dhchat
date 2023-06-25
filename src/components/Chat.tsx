import { Typography, CardActionArea, Avatar, Box } from "@mui/material";

interface ConversationProps {
  lastMessage?: string;
  lastMessageSendBy?: string;
  avatar?: string;
  name?: string;
  onClick: any;
  id: string;
}

export default function Chat({
  lastMessage,
  lastMessageSendBy,
  avatar,
  name,
  id,
  onClick,
}: ConversationProps) {
  return (
    <CardActionArea
      onClick={() => onClick(id)}
      sx={{
        maxHeight: "70px",
        p: 1,
        backgroundColor: "#A8CF45",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Avatar src={avatar} />
      <Box sx={{ flexGrow: 1, ml: 1 }}>
        <Typography variant="overline" fontWeight={800}>
          {name}
        </Typography>

        <Typography variant="inherit">
          {" "}
          {lastMessageSendBy} :{" "}
          {lastMessage && lastMessage.length > 20
            ? lastMessage.slice(0, 20) + "..."
            : lastMessage}
        </Typography>
      </Box>
    </CardActionArea>
  );
}
