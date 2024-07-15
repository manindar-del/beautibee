import DashboardWrapper from "@/layout/Wrappers/DashboardWrapper";
import styles from "@/styles/pages/chat.module.scss";
import React, { useState } from "react";
import Image from "next/image";
import assest from "@/json/assest";
import ChatMesageCard from "@/components/chatModule/ChatMesageCard";
import ChatMessageHeader from "@/components/chatModule/CharMessageHeader";
import ChatDeatilsBody from "@/components/chatModule/ChatDeatilsBody";
import ChatMessage from "@/components/chatModule/ChatMessage";
import ChatJoinedConversion from "@/components/chatModule/ChatJoinedConversion";
import { Box, Container, Grid, Stack } from "@mui/material";
import ChatWrapper from "@/components/chatModule/ChatWrapper";
import { socketInstance } from "@/lib/config/socket.config";

function index() {
  const [searchVal, setSearchVal] = useState("");

  return (
    <DashboardWrapper headerType="search" page="user" hasFooter={false}>
      <div className={styles.chat_wrapper_main}>
        <ChatWrapper>
          <div className={styles.chat_wrapper}>
            <div className={styles.chat_left_panel}>
              <div className={styles.chatMessageHeader}>
                <ChatMessageHeader />
              </div>
              <div className={styles.message_profile}>
                <ChatMesageCard socket={socketInstance} searchVal={searchVal} />
              </div>
            </div>

            <div className={styles.chat_right_panel}>
              <Stack className={styles.pageContentmiddle}>
                <figure>
                  <Image
                    src={assest.shape01}
                    width={635}
                    height={412}
                    layout="responsive"
                  />
                </figure>
                <Box className={styles.contentText}>
                  <h2>It's nice to chat with someone</h2>
                  <p>pick a person from left menu and start your conversation</p>
                </Box>
              </Stack>
            </div>
          </div>
        </ChatWrapper>
      </div>
    </DashboardWrapper>
  );
}

export default index;
