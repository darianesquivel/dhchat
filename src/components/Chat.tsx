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
        height: "70px",
        minWidth: "200px",
        p: 1,
        backgroundColor: "#f1f7e1",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Avatar src={avatar} variant="rounded" />
      <Box sx={{ flexGrow: 1, ml: 1 }}>
        <Typography variant="overline" fontWeight={800}>
          {name}
        </Typography>

        {lastMessage ? (
          <Typography variant="inherit">
            {" "}
            {lastMessageSendBy?.slice(0, lastMessageSendBy.indexOf(" "))} :{" "}
            {lastMessage.length > 20
              ? lastMessage.slice(0, 20) + "..."
              : lastMessage}
          </Typography>
        ) : null}
      </Box>
    </CardActionArea>
  );
}
