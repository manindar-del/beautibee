import React, { createRef, memo, useEffect } from "react";
import ChatMessageDate from "./ChatMessageDate";
import ChatMessageDetailsRight from "./ChatMessageDetailsRight";
import ChatMessageDetailsLeft from "./ChatMessageDetailsLeft";
import { useInView } from "react-intersection-observer";
import { useSnackbar } from "notistack";
import styles from "@/styles/pages/chat.module.scss";
import { Box, CircularProgress, Container, Grid } from "@mui/material";

const ChatMessage = memo(({ message, direction, socket }) => {

  return (
    <div className={styles.chat_cont_box}>
      {direction === "right" ? (
        <ChatMessageDetailsRight message={message} />
      ) : (
        <ChatMessageDetailsLeft message={message} socket={socket}/>
      )}
      {/* <Box ref={ref} /> */}
    </div>
  );
});

export default ChatMessage;
