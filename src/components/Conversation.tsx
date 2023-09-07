import { makeStyles } from "@mui/styles";
import { Avatar, Box, Chip, Typography } from "@mui/material";
import Message from "./Message";
import useStore from "../context/store";
import Inputbar from "./Inputbar";

export default function Conversation() {
  const classes = useStyles();
  const { messages, currentConversation }: any = useStore();
  return (
    <Box className={classes.container}>
      <Box className={classes.headerConversation}>
        <Avatar src={currentConversation?.avatar} />
        <Box className={classes.nameAndParticipants}>
          <Typography variant="overline" fontWeight={800}>
            {currentConversation?.name}
          </Typography>
          <Box>
            {currentConversation?.participants.map((e: any) => (
              <Chip key={e} size="small" label={e} />
            ))}
          </Box>
        </Box>
      </Box>
      <Box className={classes.messages}>
        {messages?.map((message: any, key: any) => {
          const {
            content,
            avatar,
            user,
            translatedContent,
            sendBy,
            sendAt,
            type,
          } = message;
          return (
            <Message
              key={key}
              content={content}
              avatar={avatar}
              name={user}
              translatedContent={translatedContent?.text}
              userId={sendBy}
              sendAt={sendAt}
              lenguage={"en"} // arreglar
              translateMe={false} // arreglar
              type={type}
            />
          );
        })}
      </Box>
      <Inputbar />
    </Box>
  );
}

const useStyles = makeStyles(() => ({
  container: {
    display: "grid",
    gridTemplateRows: "70px 1fr 70px",
    backgroundColor: "white",
  },
  emptyContainer: {},
  headerConversation: {
    backgroundColor: "#A8CF45",
    display: "flex",
    alignItems: "center",
    padding: "8px",
    gap: 5,
  },
  nameAndParticipants: {},
  messages: {
    display: "flex",
    flexDirection: "column",
    maxHeight: "calc(100vh - 160px)",
    gap: 5,
    overflowY: "auto",
    padding: 8,
  },
  footerConversation: {
    backgroundColor: "#A8CF45",
  },
}));
