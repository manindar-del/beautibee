import React from 'react';
import styles from "@/styles/pages/chat.module.scss";

const ChatJoinedConversion = ({username}) => {
  return (
    <div className={styles.cont_box}>{username} joined the conversion</div>
  )
}

export default ChatJoinedConversion