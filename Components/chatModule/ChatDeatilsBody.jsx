import React, { useEffect, useState } from "react";
import ChatDetailsHeader from "./ChatDetailsHeader";
import ChatInput from "./ChatInput";
import styles from "@/styles/pages/chat.module.scss";

const ChatDeatilsBody = ({
  children,
  socket,
  typingStatus,
  page,
  per_page,
  chat_per_page,
  isTyping
}) => {
  return (
    <div className={styles.chatWrap}>
      <ChatDetailsHeader socket={socket} />
      <div className={styles.full_message}>{children}</div>
      <div className={styles.test_typing}>
        {isTyping && typingStatus}
      </div>
      <ChatInput
        socket={socket}
        page={page}
        per_page={per_page}
        chat_per_page={chat_per_page}
      />
    </div>
  );
};

export default ChatDeatilsBody;
